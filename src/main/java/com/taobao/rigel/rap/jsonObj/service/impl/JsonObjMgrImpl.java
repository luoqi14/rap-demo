package com.taobao.rigel.rap.jsonObj.service.impl;

import com.taobao.rigel.rap.account.bo.User;
import com.taobao.rigel.rap.jsonObj.bo.JsonObj;
import com.taobao.rigel.rap.jsonObj.bo.JsonTemplate;
import com.taobao.rigel.rap.jsonObj.dao.JsonObjDao;
import com.taobao.rigel.rap.jsonObj.service.JsonObjMgr;

import java.util.List;

/**
 * Created by dashuai on 17-5-31.
 */
public class JsonObjMgrImpl implements JsonObjMgr {

    private JsonObjDao jsonObjDao;

    public JsonObjDao getJsonObjDao() {
        return jsonObjDao;
    }

    public void setJsonObjDao(JsonObjDao jsonObjDao) {
        this.jsonObjDao = jsonObjDao;
    }

    public List<JsonObj> getCommonTemplate(int teamId, int productLineId) {
        return jsonObjDao.getCommonTemplate(teamId,productLineId);
    }

    public int addCommonJson(String jsonStr,String jsonName, String describe,String addition,int teamId,int productLineId) {
        return jsonObjDao.addCommonJson(jsonStr,jsonName,describe,addition,teamId,productLineId);
    }

    public void deleteCommonJson(int jsonId) {
        jsonObjDao.deleteCommonJson(jsonId);
    }

    public void updateCommonJson(int jsonId,String jsonStr,String jsonName,String describe,String addition,int teamId,int productLineId) {
        jsonObjDao.updateCommonJson(jsonId,jsonStr,jsonName,describe,addition,teamId,productLineId);
    }
}
