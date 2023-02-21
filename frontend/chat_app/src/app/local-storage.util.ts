export class LocalStorageUtil {
  public static set(key: string, data: any): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }

  public static get(key: string, defaultValue: any) {
    try {
      const data = window.localStorage.getItem(key);
      if (data === undefined || data === "undefined" || data === null) {
        return defaultValue;
      } else {
        return JSON.parse(window.localStorage.getItem(key) ?? "");
      }
    } catch (e) {
      console.error("Error getting data from localStorage", e);
      return defaultValue;
    }
  }

  public static remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing data from localStorage", e);
      return;
    }
  }
}
