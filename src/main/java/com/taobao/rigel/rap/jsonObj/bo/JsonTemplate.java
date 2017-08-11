package com.taobao.rigel.rap.jsonObj.bo;

/**
 * Created by dashuai on 17-5-27.
 */
public class JsonTemplate {

    private int id;
    private String name;
    private String userId;
    private String data;

    public JsonTemplate() {
    }

    public JsonTemplate(int id, String name, String userId, String data) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.data = data;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
