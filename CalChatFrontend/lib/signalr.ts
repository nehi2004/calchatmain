import * as signalR from "@microsoft/signalr"

export const createConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("https://calchat-backend.onrender.com//chathub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()
}