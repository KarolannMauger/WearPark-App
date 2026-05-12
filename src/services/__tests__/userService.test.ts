import { userService } from "../userService";
import { privateApiClient } from "../api";
import { User } from "@/src/types/user";
import { ApiError } from "@/src/errors/ApiError";

jest.mock("../api");

const mockedApi = privateApiClient as jest.Mocked<typeof privateApiClient>;

describe("userService", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const baseUser: User = {
    email: "test@example.com",
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "2000-01-01T00:00:00Z",
    hasDiagnosis: false,
    userPreferences: {
      monthlyReportEmail: false,
      reportRecipients: [],
    },
  };

  it("should fetch user profile", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: baseUser });

    const result = await userService.getProfile();

    expect(result).toEqual(baseUser);
  });

  it("should throw ApiError 401 when unauthorized", async () => {
    mockedApi.get.mockRejectedValueOnce({ response: { status: 401 } });
    await expect(userService.getProfile()).rejects.toBeInstanceOf(ApiError);
  });


  it("should call updateProfile with correct payload", async () => {
    const updateData: Partial<User> = {
      firstName: "John",
      lastName: "Smith",
      dateOfBirth: "1990-05-05T00:00:00Z",
      hasDiagnosis: false,
      userPreferences: { monthlyReportEmail: true, reportRecipients: ["a@b.com"] },
    };

    mockedApi.post.mockResolvedValueOnce({});

    await userService.updateProfile(updateData);

    const calledPayload = mockedApi.post.mock.calls[0][1] as Partial<User>;

    expect(calledPayload.firstName).toBe("John");
    expect(calledPayload.lastName).toBe("Smith");
    expect(calledPayload.dateOfBirth).toBe("1990-05-05T00:00:00Z");
    expect(calledPayload.diagnosis).toBeUndefined();
    expect(calledPayload.userPreferences?.monthlyReportEmail).toBe(true);
    expect(calledPayload.userPreferences?.reportRecipients).toEqual(["a@b.com"]);
  });

  it("should keep diagnosis if hasDiagnosis=true", async () => {
    const updateData: Partial<User> = {
      firstName: "Alice",
      hasDiagnosis: true,
      diagnosis: "Parkinson",
      userPreferences: { monthlyReportEmail: false, reportRecipients: [] },
      dateOfBirth: "2000-12-12T00:00:00Z",
    };

    mockedApi.post.mockResolvedValueOnce({});

    await userService.updateProfile(updateData);

    const calledPayload = mockedApi.post.mock.calls[0][1] as Partial<User>;
    expect(calledPayload.diagnosis).toBe("Parkinson");
  });

  it("should throw ApiError 400 on invalid data", async () => {
    mockedApi.post.mockRejectedValueOnce({ response: { status: 400 } });
    await expect(userService.updateProfile({ ...baseUser, firstName: "" })).rejects.toBeInstanceOf(ApiError);
  });

  it("should throw ApiError 500 on server error", async () => {
    mockedApi.post.mockRejectedValueOnce({ response: { status: 500 } });
    await expect(userService.updateProfile(baseUser)).rejects.toBeInstanceOf(ApiError);
  });
});