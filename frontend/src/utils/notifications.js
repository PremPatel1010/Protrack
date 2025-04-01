export const showNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
};

export const scheduleReminder = (task, timeBefore) => {
  const now = new Date();
  const reminderTime = new Date(task.dueDate - timeBefore);
  
  if (reminderTime > now) {
    const timeout = reminderTime - now;
    setTimeout(() => {
      showNotification(`Reminder: ${task.title}`, task.description);
    }, timeout);
  }
};