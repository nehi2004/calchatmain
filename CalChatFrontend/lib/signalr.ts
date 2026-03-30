import * as signalR from "@microsoft/signalr"

export const createConnection = (token: string) => {
    return new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5009/chathub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build()
}