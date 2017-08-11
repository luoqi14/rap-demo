package com.taobao.rigel.rap.jsonObj.bo;

/**
 * Created by dashuai on 17-6-1.
 */
public class JsonObj {
    private int id;
    private String name;
    private String data;
    private String describe;
    private String addition;
    private int teamId;
    private int productLineId;

    public JsonObj() {
    }

    public JsonObj(String name, String data, String describe, String addition, int teamId, int productLineId) {
        this.name = name;
        this.data = data;
        this.describe = describe;
        this.addition = addition;
        this.teamId = teamId;
        this.productLineId = productLineId;
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

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }

    public String getAddition() {
        return addition;
    }

    public void setAddition(String addition) {
        this.addition = addition;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public int getProductLineId() {
        return productLineId;
    }

    public void setProductLineId(int productLineId) {
        this.productLineId = productLineId;
    }
}
