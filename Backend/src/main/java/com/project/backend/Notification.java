package com.project.backend;

public class Notification {

    private String message;
    private String user;
    private boolean read = false;

    public Notification(String message, String user) {
        this.message = message;
        this.user = user;
        this.read = false;
    }

    public String getMessage() {
        return message;
    }

    public String getUser() {
        return user;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}