class Logger {
  private packageName = '@astral/validations';

  public error = (message: string, err: Error) => {
    console.error(`${this.packageName}: ${message}`, err);
  };
}

export const logger = new Logger();
