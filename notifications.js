// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const markAllRead = document.getElementById("mark-all-read")
const notificationType = document.getElementById("notification-type")
const notificationStatus = document.getElementById("notification-status")
const notificationItems = document.querySelectorAll(".notification-item")
const prevNotifications = document.getElementById("prev-notifications")
const nextNotifications = document.getElementById("next-notifications")
const currentNotificationsPage = document.getElementById("current-notifications-page")
const totalNotificationsPages = document.getElementById("total-notifications-pages")

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme")
  localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark")
})

// Check for saved theme preference
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme")
}

// Initialize the application
function initApp() {
  // Set up event listeners
  markAllRead.addEventListener("click", markAllAsRead)
  notificationType.addEventListener("change", filterNotifications)
  notificationStatus.addEventListener("change", filterNotifications)

  prevNotifications.addEventListener("click", goToPrevPage)
  nextNotifications.addEventListener("click", goToNextPage)

  // Set up notification action buttons
  setupNotificationActions()
}

// Mark all notifications as read
function markAllAsRead() {
  notificationItems.forEach((item) => {
    item.classList.remove("unread")
  })

  // Update filter if it's set to show only unread
  if (notificationStatus.value === "unread") {
    filterNotifications()
  }
}

// Filter notifications based on type and status
function filterNotifications() {
  const type = notificationType.value
  const status = notificationStatus.value

  notificationItems.forEach((item) => {
    const showByType = type === "all" || item.classList.contains(type)
    const showByStatus =
      status === "all" ||
      (status === "unread" && item.classList.contains("unread")) ||
      (status === "read" && !item.classList.contains("unread"))

    if (showByType && showByStatus) {
      item.style.display = "flex"
    } else {
      item.style.display = "none"
    }
  })
}

// Set up notification action buttons
function setupNotificationActions() {
  const markAsReadButtons = document.querySelectorAll(".notification-action")

  markAsReadButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const notificationItem = this.closest(".notification-item")

      if (this.textContent === "Mark as Read") {
        notificationItem.classList.remove("unread")
        this.textContent = "Dismiss"

        // Remove the second button (which would be "Dismiss")
        const secondButton = this.nextElementSibling
        if (secondButton) {
          secondButton.remove()
        }
      } else if (this.textContent === "Dismiss") {
        notificationItem.style.display = "none"
      } else if (this.textContent === "Install Update") {
        alert("Update installation would start here.")
      }
    })
  })
}

// Pagination handlers
function goToPrevPage() {
  const currentPageNum = Number.parseInt(currentNotificationsPage.textContent)
  if (currentPageNum > 1) {
    currentNotificationsPage.textContent = currentPageNum - 1
    updatePaginationButtons()
    // In a real application, this would fetch the previous page of notifications
  }
}

function goToNextPage() {
  const currentPageNum = Number.parseInt(currentNotificationsPage.textContent)
  const totalPagesNum = Number.parseInt(totalNotificationsPages.textContent)
  if (currentPageNum < totalPagesNum) {
    currentNotificationsPage.textContent = currentPageNum + 1
    updatePaginationButtons()
    // In a real application, this would fetch the next page of notifications
  }
}

function updatePaginationButtons() {
  const currentPageNum = Number.parseInt(currentNotificationsPage.textContent)
  const totalPagesNum = Number.parseInt(totalNotificationsPages.textContent)

  prevNotifications.disabled = currentPageNum === 1
  nextNotifications.disabled = currentPageNum === totalPagesNum
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)

