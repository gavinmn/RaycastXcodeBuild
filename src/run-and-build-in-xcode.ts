import { showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// For TypeScript to recognize console
declare const console: {
  error: (message?: any, ...optionalParams: any[]) => void;
};

export default async function command() {
  try {
    // Check if Xcode is running
    const isXcodeRunning = await isApplicationRunning("Xcode");
    
    if (!isXcodeRunning) {
      // Show alert prompting user to open Xcode
      await showToast({
        style: Toast.Style.Failure,
        title: "Xcode is not running",
        message: "Please open Xcode first and try again",
      });
      return;
    }
    
    // Xcode is running, proceed with Xcode build and run
    await showToast({
      style: Toast.Style.Animated,
      title: "Triggering Xcode build and run...",
    });
    
    // Trigger the build and run command in Xcode
    await triggerXcodeBuildAndRun();
    
    await showToast({
      style: Toast.Style.Success,
      title: "Build and Run triggered in Xcode",
    });
  } catch (error) {
    console.error("Error:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: String(error),
    });
  }
}

// Check if a specific application is running
async function isApplicationRunning(appName: string): Promise<boolean> {
  try {
    const { stdout } = await execPromise(
      `osascript -e 'tell application "System Events" to (name of processes) contains "${appName}"'`
    );
    return stdout.trim() === "true";
  } catch (error) {
    console.error("Error checking if application is running:", error);
    return false;
  }
}

// Trigger the Build and Run command in Xcode
async function triggerXcodeBuildAndRun(): Promise<void> {
  try {
    await execPromise(
      'osascript -e \'tell application "Xcode" to activate\' -e \'tell application "System Events" to tell process "Xcode" to keystroke "r" using command down\''
    );
  } catch (error) {
    console.error("Error triggering Xcode build and run:", error);
    throw new Error("Failed to trigger Build and Run in Xcode");
  }
}
