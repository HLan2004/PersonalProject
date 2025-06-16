import { logout } from './auth'

class ActivityTracker {
    constructor() {
        this.activityTimer = null
        this.ACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
        this.isTracking = false
    }

    startTracking() {
        if (this.isTracking) return

        this.isTracking = true
        this.resetActivityTimer()

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

        events.forEach(event => {
            document.addEventListener(event, this.handleActivity.bind(this), true)
        })

        console.log('Activity tracking started')
    }

    stopTracking() {
        if (!this.isTracking) return

        this.isTracking = false
        this.clearActivityTimer()

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

        events.forEach(event => {
            document.removeEventListener(event, this.handleActivity.bind(this), true)
        })

        console.log('Activity tracking stopped')
    }

    handleActivity() {
        this.resetActivityTimer()
    }

    resetActivityTimer() {
        this.clearActivityTimer()

        this.activityTimer = setTimeout(() => {
            console.log('User inactive for 30 minutes, logging out...')
            this.handleInactiveLogout()
        }, this.ACTIVITY_TIMEOUT)
    }

    clearActivityTimer() {
        if (this.activityTimer) {
            clearTimeout(this.activityTimer)
            this.activityTimer = null
        }
    }

    async handleInactiveLogout() {
        this.stopTracking()
        await logout(false, true)
    }
}

export default new ActivityTracker()