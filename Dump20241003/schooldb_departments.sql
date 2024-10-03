-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: schooldb
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'기계시스템디자인공학과','1'),(2,'기계자동차공학과','2'),(3,'안전공학과','3'),(4,'신소재공학과','4'),(5,'건설시스템공학과','5'),(6,'건축공학전공','6'),(7,'건축학전공','7'),(8,'반도체융합공학전공','8'),(9,'전기정보공학과','9'),(10,'컴퓨터공학과','10'),(11,'스마트ICT융합공학과','11'),(12,'전자공학과','12'),(13,'IT융합소프트웨어전공','13'),(14,'화공생명공학과','14'),(15,'환경공학과','15'),(16,'식품생명공학과','16'),(17,'정밀화학과','17'),(18,'스포츠과학과','18'),(19,'안경광학과','19'),(20,'시각디자인전공','20'),(21,'산업디자인전공','21'),(22,'도예학과','22'),(23,'금속공예디자인학과','23'),(24,'조형예술학과','24'),(25,'영어영문학과','25'),(26,'행정학과','26'),(27,'문예창작학과','27'),(28,'한국문화전공','28'),(29,'산업정보시스템전공','29'),(30,'ITM전공','30'),(31,'경영학전공','31'),(32,'글로벌테크노경영전공','32'),(33,'MSDE학과','33'),(34,'빅데이터경영공학전공','34'),(35,'창업융합전공','35'),(36,'지식재산기술경영전공','36'),(37,'융합기계공학과','37'),(38,'헬스피트니스학과','38'),(39,'건설환경융합공학과','39'),(40,'문화예술학과','40'),(41,'영어과','41'),(42,'벤처경영학과','42'),(43,'정보통신융합공학과','43'),(44,'미래에너지융합학과','44'),(45,'지능형반도체공학과','45'),(46,'인공지능응용학과','46'),(47,'창업교육센터','47'),(48,'국제교류처','48'),(49,'교양대학','49'),(50,'글로벌기초교육학부','50'),(51,'글로벌한국어문화학부','51'),(52,'미래융합대학','52'),(53,'조형대학','53');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-03 16:44:28
