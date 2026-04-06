import * as signalR from "@microsoft/signalr"

export const createConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("https://steadfast-warmth-production-31cc.up.railway.app/chathub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()
}