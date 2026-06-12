package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.ClientOrderVsProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ClientOrderVsProductDao extends JpaRepository<ClientOrderVsProducts, Integer> {

//                @Query
//                ("SELECT new ClientOrderVsProducts (co.number,p.name,op.amount,op.completed) " +
//                        "FROM Orderproduct op,Clientorder co,Product p " +
//                        "WHERE co.id=op.clientorder.id " +
//                        "WHERE p.doplaced BETWEEN :startDate AND :endDate "+
//                        "AND p.id=op.product.id")
//                 List<ClientOrderVsProducts> clientOrderVsProductsdate();

        @Query
        ("SELECT new ClientOrderVsProducts (co.number,p.name,p.code,op.amount,op.completed) " +
                "FROM Orderproduct op,Clientorder co,Product p " +
                "WHERE co.id=op.clientorder.id " +
                "AND p.id=op.product.id")
        List<ClientOrderVsProducts> clientOrderVsProducts();
        
}
