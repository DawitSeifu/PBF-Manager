import project2025 from "../data/2025-projectDescriptor.js"
import { DatePeriods } from "@blsq/blsq-report-components"

const descriptors = [project2025]

descriptors.forEach(d => {
    d.startPeriod = d.start_date ? d.start_date.replace("-", "").slice(0, 6) : undefined
    d.endPeriod = d.end_date ? d.end_date.replace("-", "").slice(0, 6) : undefined
})

const minPeriod = descriptors.map(d => d.startPeriod).sort()[0]

const project = (period) => {
    const yearmonth = DatePeriods.split(period, "monthly")[0]
    if (yearmonth < minPeriod) {
        return descriptors[0]
    }
    const descriptor = descriptors.find(d => d.status == "published" && d.startPeriod <= yearmonth && yearmonth <= d.endPeriod)

    return descriptor || project2025

}

export default project