import { confirm } from "../alert";
import { Platform, Alert } from "react-native";

jest.mock("react-native", () => ({
  Platform: { OS: "web" },
  Alert: {
    alert: jest.fn(),
  },
}));

describe("confirm", () => {
  const title = "Titre";
  const message = "Message";
  const onConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("web", () => {
    beforeEach(() => {
      (Platform as any).OS = "web";
    });

    it("calls onConfirm when user confirms", () => {
      window.confirm = jest.fn().mockReturnValue(true);

      confirm(title, message, onConfirm);

      expect(window.confirm).toHaveBeenCalledWith(
        `${title}\n\n${message}`
      );
      expect(onConfirm).toHaveBeenCalled();
    });

    it("does not call onConfirm when user cancels", () => {
      window.confirm = jest.fn().mockReturnValue(false);

      confirm(title, message, onConfirm);

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      (Platform as any).OS = "ios";
    });

    it("shows Alert with correct params", () => {
      confirm(title, message, onConfirm);

      expect(Alert.alert).toHaveBeenCalledWith(
        title,
        message,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Confirmer",
            style: "destructive",
            onPress: onConfirm,
          },
        ]
      );
    });

    it("calls onConfirm when confirm button is pressed", () => {
      confirm(title, message, onConfirm);

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];

      buttons[1].onPress();

      expect(onConfirm).toHaveBeenCalled();
    });
  });
});