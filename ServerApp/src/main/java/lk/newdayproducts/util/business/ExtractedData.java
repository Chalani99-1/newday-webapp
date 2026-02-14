package lk.newdayproducts.util.business;

import java.math.BigDecimal;

public class ExtractedData {
    private BigDecimal number;
    private String text;

    public ExtractedData(BigDecimal number, String text) {
        this.number = number;
        this.text = text;
    }

    public ExtractedData() {
    }

    @Override
    public String toString() {
        return "ExtractedData{" +
               "number=" + number +
               ", text='" + text + '\'' +
               '}';
    }

    public BigDecimal getNumber() {
        return number;
    }

    public void setNumber(BigDecimal number) {
        this.number = number;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
