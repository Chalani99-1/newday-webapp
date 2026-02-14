package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
public class Grnrawmaterial {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "unitprice")
    private BigDecimal unitprice;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @Basic
    @Column(name = "linetotal")
    private BigDecimal linetotal;
    @ManyToOne @JsonIgnore
    @JoinColumn(name = "grn_id", referencedColumnName = "id", nullable = false)
    private Grn grn;
    @ManyToOne
    @JoinColumn(name = "rawmaterial_id", referencedColumnName = "id", nullable = false)
    private Rawmaterial rawmaterial;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getUnitprice() {
        return unitprice;
    }

    public void setUnitprice(BigDecimal unitprice) {
        this.unitprice = unitprice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getLinetotal() {
        return linetotal;
    }

    public void setLinetotal(BigDecimal linetotal) {
        this.linetotal = linetotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Grnrawmaterial that = (Grnrawmaterial) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (unitprice != null ? !unitprice.equals(that.unitprice) : that.unitprice != null) return false;
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null) return false;
        if (linetotal != null ? !linetotal.equals(that.linetotal) : that.linetotal != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (unitprice != null ? unitprice.hashCode() : 0);
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        result = 31 * result + (linetotal != null ? linetotal.hashCode() : 0);
        return result;
    }

    public Grn getGrn() {
        return grn;
    }

    public void setGrn(Grn grn) {
        this.grn = grn;
    }

    public Rawmaterial getRawmaterial() {
        return rawmaterial;
    }

    public void setRawmaterial(Rawmaterial rawmaterial) {
        this.rawmaterial = rawmaterial;
    }
}
