export async function requestNotificationPermission() {

    if (Notification.permission === "default") {
        await Notification.requestPermission()
    }

}

export function showNotification(title: string, body: string) {

    if (Notification.permission === "granted") {

        new Notification(title, {
            body: body,
            icon: "/logo.png"
        })

    }

}
