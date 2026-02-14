package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.newdayproducts.util.RegexPattern;


import javax.persistence.*;
import java.awt.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Rawmaterial {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "name")

    private String name;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @Basic
    @Column(name = "unitprice")

    private BigDecimal unitprice;
    @Basic
    @Column(name = "qoh")

    private BigDecimal qoh;
    @Basic
    @Column(name = "resourcelimit")
    @RegexPattern()
    private String resourcelimit;
    @Basic
    @Column(name = "rop")
    private BigDecimal rop;

    @ManyToOne
    @JoinColumn(name = "materialcategory_id", referencedColumnName = "id", nullable = false)
    private Materialcategory materialcategory;


    @ManyToOne
    @JoinColumn(name = "materialstatus_id", referencedColumnName = "id", nullable = false)
    private Materialstatus materialstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @JsonIgnore
    @OneToMany(mappedBy = "rawmaterial")
    private Collection<Poitem> poitems;
    @JsonIgnore
    @OneToMany(mappedBy = "rawmaterial")
    private Collection<Productrawmaterial> productrawmaterials;
    @JsonIgnore
    @OneToMany(mappedBy = "rawmaterial")
    private Collection<Grnrawmaterial> grnrawmaterials;

    @ManyToOne()
    @JoinColumn(name = "materialtype_id", nullable = false)
    private Materialtype materialtype;

    public Materialtype getMaterialtype() {
        return materialtype;
    }

    public void setMaterialtype(Materialtype materialtype) {
        this.materialtype = materialtype;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResourcelimit() {
        return resourcelimit;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setResourcelimit(String resourcelimit) {
        this.resourcelimit = resourcelimit;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public BigDecimal getUnitprice() {
        return unitprice;
    }

    public void setUnitprice(BigDecimal unitprice) {
        this.unitprice = unitprice;
    }

    public BigDecimal getQoh() {
        return qoh;
    }

    public void setQoh(BigDecimal qoh) {
        this.qoh = qoh;
    }

    public BigDecimal getRop() {
        return rop;
    }

    public void setRop(BigDecimal rop) {
        this.rop = rop;
    }


    public Materialcategory getMaterialcategory() {
        return materialcategory;
    }

    public void setMaterialcategory(Materialcategory materialcategory) {
        this.materialcategory = materialcategory;
    }

    public Materialstatus getMaterialstatus() {
        return materialstatus;
    }

    public void setMaterialstatus(Materialstatus materialstatus) {
        this.materialstatus = materialstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Poitem> getPoitems() {
        return poitems;
    }

    public void setPoitems(Collection<Poitem> poitems) {
        this.poitems = poitems;
    }

    public Collection<Productrawmaterial> getProductrawmaterials() {
        return productrawmaterials;
    }

    public void setProductrawmaterials(Collection<Productrawmaterial> productrawmaterials) {
        this.productrawmaterials = productrawmaterials;
    }

    public Collection<Grnrawmaterial> getGrnrawmaterials() {
        return grnrawmaterials;
    }

    public void setGrnrawmaterials(Collection<Grnrawmaterial> grnrawmaterials) {
        this.grnrawmaterials = grnrawmaterials;
    }
}
