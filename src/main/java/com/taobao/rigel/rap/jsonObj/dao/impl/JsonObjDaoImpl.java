package com.taobao.rigel.rap.jsonObj.dao.impl;

import com.taobao.rigel.rap.account.bo.User;
import com.taobao.rigel.rap.jsonObj.bo.JsonObj;
import com.taobao.rigel.rap.jsonObj.bo.JsonTemplate;
import com.taobao.rigel.rap.jsonObj.dao.JsonObjDao;
import org.hibernate.Query;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;

import java.util.List;

/**
 * Created by dashuai on 17-5-27.
 */
public class JsonObjDaoImpl extends HibernateDaoSupport implements JsonObjDao {

    public List<JsonObj> getCommonTemplate(int teamId, int productLineId) {
        String sql = "FROM com.taobao.rigel.rap.jsonObj.bo.JsonObj WHERE team_id = :team_id AND productline_id = :productline_id";
        Query query = currentSession().createQuery(sql);
        query.setInteger("team_id", teamId);
        query.setInteger("productline_id",productLineId);

        List<JsonObj> list = query.list();

        return list;
    }

    public int addCommonJson(String jsonStr, String jsonName, String describe, String addition, int teamId, int productLineId) {
        String sql = "INSERT INTO tb_json_template (`name`,`data`, `describe`,`addition`,team_id,productline_id) " +
                "VALUES (:name,:data,:describe,:addition,:team_id,:productline_id)";
        Query query = currentSession().createSQLQuery(sql);
        query.setString("name",jsonName);
        query.setString("data", jsonStr);
        query.setString("describe",describe);
        query.setString("addition",addition);
        query.setInteger("team_id",teamId);
        query.setInteger("productline_id",productLineId);

        return query.executeUpdate();
    }

    public void deleteCommonJson(int jsonId) {
        String sql = "DELETE FROM tb_json_template WHERE id = :id";
        Query query = currentSession().createSQLQuery(sql);
        query.setInteger("id", jsonId);
        query.executeUpdate();
    }

    public void updateCommonJson(int jsonId,String jsonStr,String jsonName,String describe,String addition,int teamId,int productLineId) {
        String sql = "UPDATE tb_json_template SET `name`=:name,`data`=:data ,`describe`=:describe ,`addition`=:addition WHERE `id` = :id";
        Query query = currentSession().createSQLQuery(sql);
        query.setInteger("id", jsonId);
        query.setString("name",jsonName);
        query.setString("data", jsonStr);
        query.setString("describe",describe);
        query.setString("addition",addition);
        query.executeUpdate();
    }

}
