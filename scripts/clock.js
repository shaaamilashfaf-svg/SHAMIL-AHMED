/**
 * ==========================================================================
 * SHAMIL ASHFAF — LIVE KOZHIKODE TIME (IST) CLOCK
 * Real-time clock formatted in Indian Standard Time (UTC+5:30)
 * ==========================================================================
 */

export function initKozhikodeClock() {
  const clockElement = document.getElementById('kozhikodeClock');
  if (!clockElement) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockElement.textContent = `${formatter.format(new Date())} IST`;
    } catch {
      // Fallback
      const now = new Date();
      clockElement.textContent = now.toLocaleTimeString() + ' IST';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}
