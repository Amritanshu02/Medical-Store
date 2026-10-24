package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.Entities.Medicine;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Maps a store-owner CSV onto {@link Medicine} fields.
 *
 * Required columns: name, brand, price
 * Optional columns: composition, description, available, substitutes
 *
 * Header names are case-insensitive. Spaces, dashes and extra underscores are ignored.
 * Aliases such as medicine_name, salt, in_stock, alternatives are accepted.
 */
public class MedicineCsvParser {

    public static class ParseResult {
        private final List<Medicine> medicines = new ArrayList<>();
        private final List<String> errors = new ArrayList<>();

        public List<Medicine> getMedicines() {
            return medicines;
        }

        public List<String> getErrors() {
            return errors;
        }
    }

    public ParseResult parse(InputStream inputStream) throws IOException {
        ParseResult result = new ParseResult();
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreEmptyLines(true)
                .setTrim(true)
                .setIgnoreHeaderCase(true)
                .build();

        try (CSVParser parser = new CSVParser(new InputStreamReader(inputStream, StandardCharsets.UTF_8), format)) {
            Map<String, String> headerMap = normalizeHeaders(parser.getHeaderMap());
            if (!headerMap.containsKey("name") || !headerMap.containsKey("brand") || !headerMap.containsKey("price")) {
                result.getErrors().add(
                        "CSV must include name, brand and price columns. Optional: composition, description, available, substitutes."
                );
                return result;
            }

            int rowNumber = 1;
            for (CSVRecord record : parser) {
                rowNumber++;
                if (isBlankRow(record)) {
                    continue;
                }
                try {
                    Medicine medicine = toMedicine(record, headerMap);
                    result.getMedicines().add(medicine);
                } catch (IllegalArgumentException ex) {
                    result.getErrors().add("Row " + rowNumber + ": " + ex.getMessage());
                }
            }
        }
        return result;
    }

    private Medicine toMedicine(CSVRecord record, Map<String, String> headerMap) {
        String name = value(record, headerMap, "name");
        String brand = value(record, headerMap, "brand");
        String priceRaw = value(record, headerMap, "price");

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        if (brand == null || brand.isBlank()) {
            throw new IllegalArgumentException("brand is required");
        }
        if (priceRaw == null || priceRaw.isBlank()) {
            throw new IllegalArgumentException("price is required");
        }

        double price;
        try {
            price = Double.parseDouble(priceRaw.replace(",", "").replace("₹", "").trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("price must be a number, got '" + priceRaw + "'");
        }
        if (price < 0) {
            throw new IllegalArgumentException("price cannot be negative");
        }

        Medicine medicine = new Medicine();
        medicine.setName(name.trim());
        medicine.setBrand(brand.trim());
        medicine.setPrice(price);
        medicine.setComposition(emptyToNull(value(record, headerMap, "composition")));
        medicine.setDescription(emptyToNull(value(record, headerMap, "description")));
        medicine.setSubstitutes(emptyToNull(value(record, headerMap, "substitutes")));
        medicine.setAvailable(parseBoolean(value(record, headerMap, "available"), true));
        return medicine;
    }

    private Map<String, String> normalizeHeaders(Map<String, Integer> headers) {
        Map<String, String> normalized = new HashMap<>();
        for (String header : headers.keySet()) {
            String canonical = canonicalHeader(header);
            if (canonical != null) {
                normalized.put(canonical, header);
            }
        }
        return normalized;
    }

    String canonicalHeader(String header) {
        if (header == null) {
            return null;
        }
        String key = header.toLowerCase(Locale.ROOT)
                .replaceAll("[\\s\\-]+", "_")
                .replaceAll("[^a-z0-9_]", "");

        return switch (key) {
            case "name", "medicine_name", "medicinename", "product_name", "productname" -> "name";
            case "brand", "manufacturer", "company" -> "brand";
            case "composition", "salt", "generic", "generic_name", "salt_composition" -> "composition";
            case "description", "desc", "details" -> "description";
            case "price", "mrp", "store_price", "cost" -> "price";
            case "available", "availability", "in_stock", "instock", "stock" -> "available";
            case "substitutes", "substitute", "alternatives", "alternative" -> "substitutes";
            default -> null;
        };
    }

    boolean parseBoolean(String raw, boolean defaultValue) {
        if (raw == null || raw.isBlank()) {
            return defaultValue;
        }
        String value = raw.trim().toLowerCase(Locale.ROOT);
        if (List.of("true", "yes", "y", "1", "available", "in_stock", "instock").contains(value)) {
            return true;
        }
        if (List.of("false", "no", "n", "0", "unavailable", "out_of_stock", "oos").contains(value)) {
            return false;
        }
        throw new IllegalArgumentException("available must be true/false (or yes/no/1/0), got '" + raw + "'");
    }

    private String value(CSVRecord record, Map<String, String> headerMap, String canonical) {
        String original = headerMap.get(canonical);
        if (original == null || !record.isMapped(original)) {
            return null;
        }
        return record.get(original);
    }

    private boolean isBlankRow(CSVRecord record) {
        for (String value : record) {
            if (value != null && !value.isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String emptyToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
