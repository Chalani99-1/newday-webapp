package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.CountByMaterialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByMaterialCategoryDao extends JpaRepository<CountByMaterialCategory, Integer> {
        @Query
        ("SELECT new CountByMaterialCategory(m.name, COUNT(*)) FROM Rawmaterial r, Materialcategory m WHERE m.id = r.materialcategory.id GROUP BY m.name")
        List<CountByMaterialCategory> countCountByMaterialCategory();
}
