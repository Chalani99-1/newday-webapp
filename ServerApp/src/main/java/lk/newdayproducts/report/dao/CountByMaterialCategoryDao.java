package lk.newdayproducts.report.dao;

import lk.newdayproducts.entity.Employee;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.report.entity.CountByMaterialCategory;
import org.hibernate.sql.Select;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByMaterialCategoryDao extends JpaRepository<CountByMaterialCategory, Integer> {

   @Query("SELECT new CountByMaterialCategory(mc.name,count (*)) FROM Rawmaterial r,Materialcategory mc where r.materialcategory.id=mc.id group by mc.name")
    List<CountByMaterialCategory> rawMaterialCountByMaterialCategory();
}

