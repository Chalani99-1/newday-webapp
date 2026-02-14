package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class PurchaseOrderVsRawMaterials {
    @Id
    private Integer id;
    private String number;
    private Integer rmId;
    private String rmName;
    private BigDecimal quentity;
    private Integer receivedAmount;
    private BigDecimal receivedPercentage;

    public PurchaseOrderVsRawMaterials() {
    }

    public PurchaseOrderVsRawMaterials(String number, Integer rmId, String rmName, BigDecimal quentity, Integer receivedAmount, BigDecimal receivedPercentage) {
        this.number = number;
        this.rmId = rmId;
        this.rmName = rmName;
        this.quentity = quentity;
        this.receivedAmount = receivedAmount;
        this.receivedPercentage = receivedPercentage;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getRmId() {
        return rmId;
    }

    public void setRmId(Integer rmId) {
        this.rmId = rmId;
    }

    public String getRmName() {
        return rmName;
    }

    public void setRmName(String rmName) {
        this.rmName = rmName;
    }

    public BigDecimal getQuentity() {
        return quentity;
    }

    public void setQuentity(BigDecimal quentity) {
        this.quentity = quentity;
    }

    public Integer getReceivedAmount() {
        return receivedAmount;
    }

    public void setReceivedAmount(Integer receivedAmount) {
        this.receivedAmount = receivedAmount;
    }

    public BigDecimal getReceivedPercentage() {
        return receivedPercentage;
    }

    public void setReceivedPercentage(BigDecimal receivedPercentage) {
        this.receivedPercentage = receivedPercentage;
    }
}
