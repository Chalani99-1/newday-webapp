package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;

@Entity
public class Materialcategory {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "mcsize_id", referencedColumnName = "id", nullable = false)
    private Mcsize mcsize;

    @JsonIgnore
    @OneToMany(mappedBy = "materialcategory")
    private Collection<Rawmaterial> rawmaterials;

    @JsonIgnore
    @OneToMany(mappedBy = "materialcategory")
    private Collection<Suppliermaterialcategory> suppliermaterialcategories;

    @ManyToOne()
    @JoinColumn(name = "materialtype_id", nullable = false)
    private Materialtype materialtype;

    public Materialtype getMaterialtype() {
        return materialtype;
    }

    public void setMaterialtype(Materialtype materialtype) {
        this.materialtype = materialtype;
    }

    public Mcsize getMcsize() {
        return mcsize;
    }

    public void setMcsize(Mcsize mcsize) {
        this.mcsize = mcsize;
    }

    @Override
    public String toString() {
        return "Materialcategory{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", mcsize=" + mcsize +
               ", rawmaterials=" + rawmaterials +
               ", suppliermaterialcategories=" + suppliermaterialcategories +
               ", materialtype=" + materialtype +
               '}';
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Materialcategory that = (Materialcategory) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    public Collection<Rawmaterial> getRawmaterials() {
        return rawmaterials;
    }

    public void setRawmaterials(Collection<Rawmaterial> rawmaterials) {
        this.rawmaterials = rawmaterials;
    }

    public Collection<Suppliermaterialcategory> getSuppliermaterialcategories() {
        return suppliermaterialcategories;
    }

    public void setSuppliermaterialcategories(Collection<Suppliermaterialcategory> suppliermaterialcategories) {
        this.suppliermaterialcategories = suppliermaterialcategories;
    }
}
