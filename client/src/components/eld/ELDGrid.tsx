// src/components/eld/ELDGrid.tsx
import React from "react";
import { Box } from "@mui/material";
import type { DutySegment } from "../../types/log";

const STATUS_ORDER: Record<string, number> = {
    OFF_DUTY: 0,
    SLEEPER: 1,
    DRIVING: 2,
    ON_DUTY: 3,
};

const STATUS_LABELS = ["Off Duty", "Sleeper", "Driving", "On Duty"];

// رنگ خط‌ها برای هر استیت
const STATUS_COLORS: Record<string, string> = {
    OFF_DUTY: "#4caf50",
    SLEEPER: "#2196f3",
    DRIVING: "#f44336",
    ON_DUTY: "#ff9800",
};

interface Props {
    segments: DutySegment[]; // { start: string, end: string, status: string }
}

export default function ELDGrid({ segments }: Props) {
    const width = 800; // پیکسل
    const height = 200;
    const hourWidth = width / 24;
    const rowHeight = height / STATUS_LABELS.length;

    // helper: تبدیل HH:mm به دقیقه
    const toMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const lines = segments.map((seg, idx) => {
        const startMin = /^\d{2}:\d{2}$/.test((seg.start as string))
            ? toMinutes((seg.start as string))
            : Number(seg.start);
        const endMin = /^\d{2}:\d{2}$/.test((seg.end as string))
            ? toMinutes((seg.end as string))
            : Number(seg.end);

        const y = height - STATUS_ORDER[seg.status] * rowHeight - rowHeight / 2;
        const x1 = (startMin / 60) * hourWidth;
        const x2 = (endMin / 60) * hourWidth;

        return (
            <line
                key={idx}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={STATUS_COLORS[seg.status] || "#000"}
                strokeWidth={3}
            />
        );
    });

    return (
        <Box sx={{ overflowX: "auto", background: "#fff", border: "1px solid #ccc", padding: 1 }}>
            <svg width={width} height={height}>
                {Array.from({ length: 25 }).map((_, i) => (
                    <line
                        key={`grid-x-${i}`}
                        x1={i * hourWidth}
                        y1={0}
                        x2={i * hourWidth}
                        y2={height}
                        stroke="#ccc"
                        strokeWidth={1}
                    />
                ))}

                {STATUS_LABELS.map((label, i) => (
                    <g key={`grid-y-${i}`}>
                        <line
                            x1={0}
                            y1={height - i * rowHeight - rowHeight / 2}
                            x2={width}
                            y2={height - i * rowHeight - rowHeight / 2}
                            stroke="#eee"
                            strokeWidth={1}
                        />
                        <text
                            x={5}
                            y={height - i * rowHeight - rowHeight / 2 - 4}
                            fontSize={10}
                            fill="#333"
                        >
                            {label}
                        </text>
                    </g>
                ))}

                {lines}
            </svg>
        </Box>
    );
}
