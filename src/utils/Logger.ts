function formatDate(date: Date): string {
  return String(date.getHours()) + ':' + String(date.getMinutes()) + ':' + String(date.getSeconds());
}

function format(type: string, title: string, message: string, date: Date, backgroundColor: string, textColor: string): void {
  console.log(`${backgroundColor} ${type} ${formatDate(date)} - ${title} \x1b[0m ${textColor}${message}\x1b[0m`);
}

function log(title: string, message: string): void {
  format('INFO', title, message, new Date(), '\x1b[42m', '\x1b[32m');
}

function warn(title: string, message: string): void {
  format('WARN', title, message, new Date(), '\x1b[43m', '\x1b[33m');
}

function error(title: string, message: string): void {
  format('ERROR', title, message, new Date(), '\x1b[41m', '\x1b[31m');
}

export { log, warn, error };
