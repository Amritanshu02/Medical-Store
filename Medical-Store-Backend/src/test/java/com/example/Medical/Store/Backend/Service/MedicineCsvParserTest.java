package com.example.Medical.Store.Backend.Service;

import com.example.Medical.Store.Backend.Entities.Medicine;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MedicineCsvParserTest {

    private final MedicineCsvParser parser = new MedicineCsvParser();

    @Test
    void parsesRequiredAndOptionalColumns() throws Exception {
        String csv = String.join("\n",
                "name,brand,composition,description,price,available,substitutes",
                "Dolo 650,Micro Labs,Paracetamol 650mg,Fever tablet,30.5,true,\"Crocin 650, Calpol 650\"",
                ""
        );

        MedicineCsvParser.ParseResult result = parser.parse(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)));

        assertTrue(result.getErrors().isEmpty());
        assertEquals(1, result.getMedicines().size());
        Medicine medicine = result.getMedicines().get(0);
        assertEquals("Dolo 650", medicine.getName());
        assertEquals("Micro Labs", medicine.getBrand());
        assertEquals("Paracetamol 650mg", medicine.getComposition());
        assertEquals(30.5, medicine.getPrice());
        assertTrue(medicine.isAvailable());
        assertEquals("Crocin 650, Calpol 650", medicine.getSubstitutes());
    }

    @Test
    void acceptsHeaderAliasesAndFalseAvailability() throws Exception {
        String csv = String.join("\n",
                "medicine_name,manufacturer,salt,mrp,in_stock,alternatives",
                "Azithral 500,Alembic,Azithromycin 500mg,119,no,Azee 500",
                ""
        );

        MedicineCsvParser.ParseResult result = parser.parse(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)));

        assertEquals(1, result.getMedicines().size());
        Medicine medicine = result.getMedicines().get(0);
        assertEquals("Azithral 500", medicine.getName());
        assertEquals("Alembic", medicine.getBrand());
        assertEquals("Azithromycin 500mg", medicine.getComposition());
        assertFalse(medicine.isAvailable());
        assertEquals("Azee 500", medicine.getSubstitutes());
    }

    @Test
    void reportsMissingRequiredColumns() throws Exception {
        String csv = "brand,price\nMicro Labs,10\n";
        MedicineCsvParser.ParseResult result = parser.parse(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)));
        assertTrue(result.getMedicines().isEmpty());
        assertFalse(result.getErrors().isEmpty());
    }

    @Test
    void reportsInvalidPriceOnRow() throws Exception {
        String csv = "name,brand,price\nDolo 650,Micro Labs,abc\n";
        MedicineCsvParser.ParseResult result = parser.parse(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)));
        assertTrue(result.getMedicines().isEmpty());
        assertTrue(result.getErrors().get(0).contains("price"));
    }

    @Test
    void canonicalHeaderMapsAliases() {
        assertEquals("name", parser.canonicalHeader("Medicine Name"));
        assertEquals("composition", parser.canonicalHeader("salt_composition"));
        assertEquals("available", parser.canonicalHeader("in-stock"));
        assertEquals("substitutes", parser.canonicalHeader("alternatives"));
    }
}
