-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: kapilagarments
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation`
--

LOCK TABLES `designation` WRITE;
/*!40000 ALTER TABLE `designation` DISABLE KEYS */;
INSERT INTO `designation` VALUES (1,'Admin'),(2,'Manager'),(3,'Store Keeper'),(4,'Production Supervisor');
/*!40000 ALTER TABLE `designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` char(4) DEFAULT NULL,
  `fullname` varchar(150) DEFAULT NULL,
  `callingname` varchar(45) DEFAULT NULL,
  `photo` longblob,
  `gender_id` int NOT NULL,
  `dobirth` date DEFAULT NULL,
  `nic` char(12) DEFAULT NULL,
  `address` text,
  `mobile` char(10) DEFAULT NULL,
  `land` char(10) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `emptype_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `doassignment` date DEFAULT NULL,
  `description` text,
  `empstatus_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_gender_idx` (`gender_id`),
  KEY `fk_employee_designation1_idx` (`designation_id`),
  KEY `fk_employee_empstatus1_idx` (`empstatus_id`),
  KEY `fk_employee_emptype1_idx` (`emptype_id`),
  CONSTRAINT `fk_employee_designation1` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`id`),
  CONSTRAINT `fk_employee_empstatus1` FOREIGN KEY (`empstatus_id`) REFERENCES `empstatus` (`id`),
  CONSTRAINT `fk_employee_emptype1` FOREIGN KEY (`emptype_id`) REFERENCES `emptype` (`id`),
  CONSTRAINT `fk_employee_gender` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'2201','Administrator','Admin',_binary 'data:image/png;base64,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',1,'1986-03-24','897655344V','Bandarawela','0768348418','0574578545','admin@kapila.lk',1,1,'2024-01-10','Admin And Owner',1),(2,'2202','Ashan Dissanayake','Ashan',_binary 'data:image/png;base64,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',1,'2001-08-24','200123701980','Dambulla Road, Sigiriya','0770610861','0665714150','ashan@gamil.com',1,4,'2024-01-11','Production Supervisor',1),(4,'2203','Kasun Sampth','Kasun',_binary 'data:image/png;base64,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',1,'1997-08-06','897652842v','No 30 ,Maradana Road, Borella','0987656342','','kasun@gmail.com',3,3,'2024-08-01','Store Keeper',1),(5,'2204','Supun Sampath','Supun',_binary 'data:image/jpeg;base64,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',1,'1967-02-08','676546342v','Badulla','0783457899','0576553321','supun@kapila.lk',1,2,'2024-07-10','General Manager',1);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empstatus`
--

DROP TABLE IF EXISTS `empstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empstatus`
--

LOCK TABLES `empstatus` WRITE;
/*!40000 ALTER TABLE `empstatus` DISABLE KEYS */;
INSERT INTO `empstatus` VALUES (1,'Assigned'),(2,'Unassigned'),(3,'Suspended'),(4,'Resignation');
/*!40000 ALTER TABLE `empstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emptype`
--

DROP TABLE IF EXISTS `emptype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emptype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emptype`
--

LOCK TABLES `emptype` WRITE;
/*!40000 ALTER TABLE `emptype` DISABLE KEYS */;
INSERT INTO `emptype` VALUES (1,'Permanent'),(2,'Volunteer'),(3,'Contract');
/*!40000 ALTER TABLE `emptype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` VALUES (1,'Male'),(2,'Female'),(3,'Other');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'Employee'),(2,'User'),(3,'Privilege'),(4,'Raw Material'),(5,'Product'),(6,'Supplier'),(7,'Purchase Order'),(8,'Grn'),(9,'Client'),(10,'Client Order'),(11,'Production Order'),(12,'Production'),(13,'Supplier Payment'),(15,'Raw Material Count By Material Category'),(16,'Product Count By Category'),(17,'Count By Designation'),(18,'Operation'),(19,'Supplier Count By Material Category'),(20,'Purchase Order Count By Date'),(21,'Production Order Count By Date'),(22,'Client Count by State'),(23,'Production vs Product Amount'),(24,'Client Order Count By Date'),(25,'Invoice'),(26,'Material Category'),(27,'RawMat Count and Rop'),(28,'Purchase Order Received Percentage'),(29,'Product Order Completion'),(30,'Product Category'),(31,'Product Type'),(32,'Product Completion in Client Orders'),(33,'Profit By Order'),(34,'Communication'),(35,'Expense By Purchase Order');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation`
--

DROP TABLE IF EXISTS `operation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `module_id` int DEFAULT NULL,
  `opetype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_operation_module1_idx` (`module_id`),
  KEY `fk_operation_opetype1_idx` (`opetype_id`),
  CONSTRAINT `fk_operation_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_operation_opetype1` FOREIGN KEY (`opetype_id`) REFERENCES `opetype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation`
--

LOCK TABLES `operation` WRITE;
/*!40000 ALTER TABLE `operation` DISABLE KEYS */;
INSERT INTO `operation` VALUES (2,'Insert',4,1),(3,'Update',4,1),(6,'view',16,1),(7,'view',15,1),(8,'insert',11,1),(9,'Delete',4,1),(10,'Update',11,1),(11,'Delete',11,1);
/*!40000 ALTER TABLE `operation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opetype`
--

DROP TABLE IF EXISTS `opetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opetype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opetype`
--

LOCK TABLES `opetype` WRITE;
/*!40000 ALTER TABLE `opetype` DISABLE KEYS */;
INSERT INTO `opetype` VALUES (1,'Default'),(2,'Spesific');
/*!40000 ALTER TABLE `opetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privilege`
--

DROP TABLE IF EXISTS `privilege`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilege` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `module_id` int NOT NULL,
  `operation_id` int NOT NULL,
  `authority` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_privilage_role1_idx` (`role_id`),
  KEY `fk_privilage_module1_idx` (`module_id`),
  KEY `fk_privilage_operation1_idx` (`operation_id`),
  CONSTRAINT `fk_privilage_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_privilage_operation1` FOREIGN KEY (`operation_id`) REFERENCES `operation` (`id`),
  CONSTRAINT `fk_privilage_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilege`
--

LOCK TABLES `privilege` WRITE;
/*!40000 ALTER TABLE `privilege` DISABLE KEYS */;
INSERT INTO `privilege` VALUES (10,3,4,2,'raw material-insert'),(11,3,4,6,'raw material-view'),(12,3,5,2,'product-insert'),(13,3,4,3,'raw material-update'),(14,3,5,3,'product-update'),(15,3,15,6,'raw material count by material category-view'),(17,4,11,2,'production order-insert'),(18,4,11,3,'production order-update'),(19,4,11,9,'production order-delete'),(20,4,11,6,'production order-view'),(21,4,12,2,'production-insert'),(22,4,21,6,'production order count by date-view'),(23,4,23,6,'production vs product amount-view'),(24,3,27,6,'rawmat count and rop-view'),(25,2,32,2,'product completion in client orders-insert'),(26,2,9,6,'client-view'),(27,2,10,6,'client order-view'),(28,2,6,6,'supplier-view'),(29,2,7,6,'purchase order-view'),(30,2,8,7,'grn-view'),(31,2,13,6,'supplier payment-view'),(32,2,19,7,'supplier count by material category-view'),(33,2,20,7,'purchase order count by date-view'),(34,2,22,6,'client count by state-view'),(35,2,24,7,'client order count by date-view'),(36,2,25,6,'invoice-view'),(37,2,28,6,'purchase order received percentage-view'),(38,2,32,6,'product completion in client orders-view'),(39,2,33,6,'profit by order-view'),(40,2,34,2,'communication-insert'),(41,3,34,2,'communication-insert'),(42,4,34,2,'communication-insert'),(43,3,7,2,'purchase order-insert'),(44,3,8,2,'grn-insert');
/*!40000 ALTER TABLE `privilege` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin'),(2,'General Manager'),(3,'Store Keeper'),(4,'Production Supervisor');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `docreated` date DEFAULT NULL,
  `tocreated` time DEFAULT NULL,
  `description` text,
  `usestatus_id` int NOT NULL,
  `usetype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_usestatus1_idx` (`usestatus_id`),
  KEY `fk_user_employee1_idx` (`employee_id`),
  KEY `fk_user_usetype1_idx` (`usetype_id`),
  CONSTRAINT `fk_user_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_user_usestatus1` FOREIGN KEY (`usestatus_id`) REFERENCES `usestatus` (`id`),
  CONSTRAINT `fk_user_usetype1` FOREIGN KEY (`usetype_id`) REFERENCES `usetype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (5,1,'Admin123','$2a$10$EmdOLR.iQnaNGI7DxjpcXOYKI3LKV4HzNO.t8BPT9OBcG10mqkN4.','$2a$10$LdtkhaP/ZP4kqnPt.jIBpeaNn7mMHfx0BH7o2/zcAftoNO/.cGDZy','2024-08-02','10:44:13','Admin@123',1,1),(6,4,'Kasun123','$2a$10$yypg8al1oV2np7Rp/r3waeUfrK1OMl7e45wTYw.S/UOyUwkkVK9mG','$2a$10$7DQiKXnZJM6D74Kgy7hwpuF.K/doD4qY.iI5xdn2IjnBGDDgNBCcC','2024-08-02','10:51:15','Kasun@123',1,2),(7,2,'Asan123','$2a$10$DV803oDmgdWDBIqiD3Gj4utysM09Yv8jclexvrV8lh5QjuIMRHGDW','$2a$10$uEZA7ANwEcoAbgHzKwuUoefObytN30X06wIKm5q5OR88lLgPbOTGS','2024-08-02','01:36:52','Ashan123#',1,1),(8,5,'Supun123','$2a$10$9O1HPd5WPmI8NwfPhYgEvu2Q0Bg10khYNk8iBn/nMLCL7cJ2K3dXy','$2a$10$9/uJt7K.zIoF7SLyu2z70erXgDEtGvBUrJqlwg5bT4ztX1U88D.5G','2024-11-05','09:48:15','Supun@123',1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userrole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_has_role_role1_idx` (`role_id`),
  KEY `fk_user_has_role_user1_idx` (`user_id`),
  CONSTRAINT `fk_user_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_user_has_role_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES (8,6,3),(9,7,4),(11,8,2),(12,5,1);
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usestatus`
--

DROP TABLE IF EXISTS `usestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usestatus`
--

LOCK TABLES `usestatus` WRITE;
/*!40000 ALTER TABLE `usestatus` DISABLE KEYS */;
INSERT INTO `usestatus` VALUES (1,'Active'),(2,'Inactive'),(3,'Blocked');
/*!40000 ALTER TABLE `usestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usetype`
--

DROP TABLE IF EXISTS `usetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usetype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usetype`
--

LOCK TABLES `usetype` WRITE;
/*!40000 ALTER TABLE `usetype` DISABLE KEYS */;
INSERT INTO `usetype` VALUES (1,'Registered'),(2,'Guest');
/*!40000 ALTER TABLE `usetype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12 11:08:58
