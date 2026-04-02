import * as signalR from "@microsoft/signalr"

export const createConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("https://calchatmain-production-75c1.up.railway.app//chathub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()
}