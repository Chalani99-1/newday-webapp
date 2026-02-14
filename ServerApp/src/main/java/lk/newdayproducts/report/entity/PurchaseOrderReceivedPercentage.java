package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.List;

@Entity
public class PurchaseOrderReceivedPercentage {

    private Integer id;
    private String number;
    private BigDecimal receivedpercentage;

    public PurchaseOrderReceivedPercentage() {
    }

    public PurchaseOrderReceivedPercentage(String number, BigDecimal receivedpercentage) {
        this.number = number;
        this.receivedpercentage = receivedpercentage;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public BigDecimal getReceivedpercentage() {
        return receivedpercentage;
    }

    public void setReceivedpercentage(BigDecimal receivedpercentage) {
        this.receivedpercentage = receivedpercentage;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Id
    public Integer getId() {
        return id;
    }


}
