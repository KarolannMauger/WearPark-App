import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { UserProvider, useUser } from "../UserContext";
import * as authServiceModule from "@/src/services/authService";
import * as userServiceModule from "@/src/services/userService";
import { storage } from "@/src/utils/storage";
import { useSegments } from "expo-router";
import { User } from "@/src/types/user";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockReplace }),
  useSegments: jest.fn(),
}));

jest.mock("@/src/utils/storage");
jest.mock("@/src/services/authService");
jest.mock("@/src/services/userService");

describe("UserContext", () => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => React.createElement(UserProvider, null, children);

  const mockUser: User = {
    email: "test@test.com",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "2000-01-01",
    role: "USER",
    hasDiagnosis: false,
    userPreferences: {
      monthlyReportEmail: false,
      reportRecipients: [],
    },
    device: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should load user if token exists", async () => {
    (storage.get as jest.Mock).mockResolvedValue("token");
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(mockUser);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual({
      ...mockUser,
      userPreferences: {
        monthlyReportEmail: false,
        reportRecipients: [],
      },
    });
  });

  it("should not set user if no token", async () => {
    (storage.get as jest.Mock).mockResolvedValue(null);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
  });


  it("redirects to / if not logged", async () => {
    (storage.get as jest.Mock).mockResolvedValue(null);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("redirects to complete-profile if incomplete", async () => {
    const incompleteUser: User = {
      ...mockUser,
      firstName: "",
    };

    (storage.get as jest.Mock).mockResolvedValue("token");
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(incompleteUser);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(auth)/complete-profile");
    });
  });

  it("redirects auth user to home if profile complete", async () => {
    (storage.get as jest.Mock).mockResolvedValue("token");
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(mockUser);
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home");
    });
  });

  it("redirects admin to admin dashboard", async () => {
    const adminUser: User = { ...mockUser, role: "ADMIN" };

    (storage.get as jest.Mock).mockResolvedValue("token");
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(adminUser);
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    renderHook(() => useUser(), { wrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });


  it("login should set user and redirect", async () => {
    (authServiceModule.authService.login as jest.Mock).mockResolvedValue(undefined);
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(mockUser);
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login("email", "password");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/home");
  });

  it("login should throw on error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => { });

    (authServiceModule.authService.login as jest.Mock).mockRejectedValue(new Error("fail"));
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(result.current.login("a", "b")).rejects.toThrow("fail");
  });


  it("register should redirect user to complete-profile", async () => {
    const incompleteUser: User = { ...mockUser, firstName: "" }; // ← profil incomplet

    (authServiceModule.authService.register as jest.Mock).mockResolvedValue(undefined);
    (authServiceModule.authService.login as jest.Mock).mockResolvedValue(undefined);
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(incompleteUser);
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register("new@test.com", "password");
    });

    expect(mockReplace).toHaveBeenCalledWith("/(auth)/complete-profile");
    expect(result.current.user).toEqual(incompleteUser);
  });

  it("register should redirect admin to admin home", async () => {
    const adminUser: User = { ...mockUser, role: "ADMIN" };

    (authServiceModule.authService.register as jest.Mock).mockResolvedValue(undefined);
    (authServiceModule.authService.login as jest.Mock).mockResolvedValue(undefined);
    (userServiceModule.userService.getProfile as jest.Mock).mockResolvedValue(adminUser);
    (useSegments as jest.Mock).mockReturnValue(["(auth)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.register("admin@test.com", "password");
    });

    expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("logout should clear user and redirect", async () => {
    (authServiceModule.authService.logout as jest.Mock).mockResolvedValue(undefined);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });


  it("updateUser should update state", async () => {
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const updatedUser: User = { ...mockUser, firstName: "Jane" };

    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user?.firstName).toBe("Jane");
  });

  it("refreshUser should update user state", async () => {
    const updatedUser: User = { ...mockUser, firstName: "Updated" };

    (storage.get as jest.Mock).mockResolvedValue("token");
    (userServiceModule.userService.getProfile as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(updatedUser);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user?.firstName).toBe("Updated");
  });

  it("useUser throws outside provider", () => {
    const hookCall = () => renderHook(() => useUser());
    expect(hookCall).toThrow("useUser must be used within a UserProvider");
  });
});