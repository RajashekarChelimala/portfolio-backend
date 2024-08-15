import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';  // Import fs/promises
import path from 'path';

// Function to log events
const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logDir = path.join(process.cwd(), 'logs');  // Use process.cwd() for root directory
        if (!fs.existsSync(logDir)) {
            await fsPromises.mkdir(logDir);
        }

        await fsPromises.appendFile(path.join(logDir, logName), logItem);
    } catch (err) {
        console.error(err);
    }
}

// Middleware logger function
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

// Export functions
export { logger, logEvents };