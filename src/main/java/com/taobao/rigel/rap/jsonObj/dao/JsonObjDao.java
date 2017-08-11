package com.taobao.rigel.rap.jsonObj.dao;

import com.taobao.rigel.rap.account.bo.User;
import com.taobao.rigel.rap.jsonObj.bo.JsonObj;
import com.taobao.rigel.rap.jsonObj.bo.JsonTemplate;

import java.util.List;

/**
 * Created by dashuai on 17-5-27.
 */
public interface JsonObjDao {

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

    /**
     * 根据id删除json模板
     * @param jsonId
     */
    void deleteCommonJson(int jsonId);

    /**
     * 根据id修改json模板
     * @param jsonId
     * @param jsonStr
     * @param jsonName
     */
    void updateCommonJson(int jsonId,String jsonStr,String jsonName,String describe,String addition,int teamId,int productLineId);

}
