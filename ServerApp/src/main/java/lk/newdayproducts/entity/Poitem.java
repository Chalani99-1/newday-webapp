package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
public class Poitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "quentity")
    private BigDecimal quentity;
    @Basic
    @Column(name = "expectedlinecost")
    private BigDecimal expectedlinecost;
    @Basic
    @Column(name = "receivedamount")
    private Integer receivedamount;

    @ManyToOne @JsonIgnore
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id", nullable = false)
    private Purchaseorder purchaseorder;
    @ManyToOne
    @JoinColumn(name = "rawmaterial_id", referencedColumnName = "id", nullable = false)
    private Rawmaterial rawmaterial;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getQuentity() {
        return quentity;
    }

    public void setQuentity(BigDecimal quentity) {
        this.quentity = quentity;
    }

    public BigDecimal getExpectedlinecost() {
        return expectedlinecost;
    }

    public void setExpectedlinecost(BigDecimal expectedlinecost) {
        this.expectedlinecost = expectedlinecost;
    }

    public Integer getReceivedamount() {
        return receivedamount;
    }

    public void setReceivedamount(Integer receivedamount) {
        this.receivedamount = receivedamount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Poitem poitem = (Poitem) o;

        if (id != null ? !id.equals(poitem.id) : poitem.id != null) return false;
        if (quentity != null ? !quentity.equals(poitem.quentity) : poitem.quentity != null) return false;
        if (expectedlinecost != null ? !expectedlinecost.equals(poitem.expectedlinecost) : poitem.expectedlinecost != null) {
            return false;
        }
        if (receivedamount != null ? !receivedamount.equals(poitem.receivedamount) : poitem.receivedamount != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (quentity != null ? quentity.hashCode() : 0);
        result = 31 * result + (expectedlinecost != null ? expectedlinecost.hashCode() : 0);
        result = 31 * result + (receivedamount != null ? receivedamount.hashCode() : 0);
        return result;
    }

    public Purchaseorder getPurchaseorder() {
        return purchaseorder;
    }

    public void setPurchaseorder(Purchaseorder purchaseorder) {
        this.purchaseorder = purchaseorder;
    }

    public Rawmaterial getRawmaterial() {
        return rawmaterial;
    }

    public void setRawmaterial(Rawmaterial rawmaterial) {
        this.rawmaterial = rawmaterial;
    }
}
