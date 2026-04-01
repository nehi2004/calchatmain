# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore "CalChatBackend/CalChatAPI/CalChatAPI.csproj"

# 🔥 IMPORTANT FIX
RUN dotnet publish "CalChatBackend/CalChatAPI/CalChatAPI.csproj" \
    -c Release \
    -r linux-x64 \
    --self-contained false \
    -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "CalChatAPI.dll"]