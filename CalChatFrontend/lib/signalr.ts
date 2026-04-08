import * as signalR from "@microsoft/signalr"

export const createConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("https://steadfast-warmth-production-64c8.up.railway.app/chathub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()
}