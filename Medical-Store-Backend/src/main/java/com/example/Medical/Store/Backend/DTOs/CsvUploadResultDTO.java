package com.example.Medical.Store.Backend.DTOs;

import java.util.ArrayList;
import java.util.List;

public class CsvUploadResultDTO {
    private int created;
    private int updated;
    private int skipped;
    private List<String> errors = new ArrayList<>();
    private List<String> expectedColumns = List.of(
            "name", "brand", "composition", "description", "price", "available", "substitutes"
    );

    public int getCreated() {
        return created;
    }

    public void setCreated(int created) {
        this.created = created;
    }

    public int getUpdated() {
        return updated;
    }

    public void setUpdated(int updated) {
        this.updated = updated;
    }

    public int getSkipped() {
        return skipped;
    }

    public void setSkipped(int skipped) {
        this.skipped = skipped;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getExpectedColumns() {
        return expectedColumns;
    }

    public void setExpectedColumns(List<String> expectedColumns) {
        this.expectedColumns = expectedColumns;
    }

    public void incrementCreated() {
        this.created++;
    }

    public void incrementUpdated() {
        this.updated++;
    }

    public void incrementSkipped() {
        this.skipped++;
    }
}
