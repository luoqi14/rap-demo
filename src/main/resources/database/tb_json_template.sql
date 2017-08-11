/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : rap_db

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-07-14 11:18:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tb_json_template
-- ----------------------------
DROP TABLE IF EXISTS `tb_json_template`;
CREATE TABLE `tb_json_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `data` text,
  `describe` varchar(128) DEFAULT NULL,
  `addition` varchar(128) DEFAULT NULL,
  `team_id` int(11) NOT NULL,
  `productline_Id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
