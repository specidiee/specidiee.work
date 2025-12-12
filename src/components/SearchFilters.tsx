"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchFilters.module.css";

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        setFromDate(searchParams.get("from") || "");
        setToDate(searchParams.get("to") || "");
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (fromDate) params.set("from", fromDate);
        else params.delete("from");

        if (toDate) params.set("to", toDate);
        else params.delete("to");

        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("from");
        params.delete("to");
        setFromDate("");
        setToDate("");
        router.push(`/search?${params.toString()}`);
    }

    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <label htmlFor="from-date" className={styles.label}>From</label>
                <input
                    id="from-date"
                    type="date"
                    className={styles.dateInput}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
            </div>
            <div className={styles.group}>
                <label htmlFor="to-date" className={styles.label}>To</label>
                <input
                    id="to-date"
                    type="date"
                    className={styles.dateInput}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>
            <div className={styles.actions}>
                <button onClick={handleApply} className={styles.applyButton}>
                    Apply
                </button>
                {(fromDate || toDate) && (
                    <button onClick={clearFilters} className={styles.clearButton}>
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
