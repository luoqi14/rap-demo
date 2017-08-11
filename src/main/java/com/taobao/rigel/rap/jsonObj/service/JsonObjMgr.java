package com.taobao.rigel.rap.jsonObj.service;

import com.taobao.rigel.rap.account.bo.User;
import com.taobao.rigel.rap.jsonObj.bo.JsonObj;
import com.taobao.rigel.rap.jsonObj.bo.JsonTemplate;

import java.util.List;

/**
 * Created by dashuai on 17-5-31.
 */
public interface JsonObjMgr {

    /**
     * 获取公共的json模板
     * @return
     */
    List<JsonObj> getCommonTemplate(int teamId, int productLineId);

    /**
     * 添加json模板
     * @return
     */
    int addCommonJson(String jsonStr,String jsonName, String describe,String addition,int teamId,int productLineId);

    void deleteCommonJson(int jsonId);

    void updateCommonJson(int jsonId,String jsonStr,String jsonName,String describe,String addition,int teamId,int productLineId);
}
