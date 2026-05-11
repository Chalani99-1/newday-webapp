package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.CountByMaterialCategory;
import lk.newdayproducts.report.entity.SupplierCountByMaterialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierCountByMaterialCategoryDao extends JpaRepository<SupplierCountByMaterialCategory, Integer> {
        @Query
        ("SELECT new SupplierCountByMaterialCategory (mc.name, COUNT(mc.name)) FROM Suppliermaterialcategory spmc, Materialcategory mc WHERE mc.id = spmc.materialcategory.id GROUP BY mc.name")
        List<SupplierCountByMaterialCategory> countSupplierCountByMaterialCategory();

}
