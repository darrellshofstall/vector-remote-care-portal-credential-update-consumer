const models = require('vector-sequelize-model');
const reportInclude = [
    {
        model: models.Device,
        required: true,
        include: [
            {
                model: models.PortalPatient,
                required: true,

                include: [
                    {
                        model: models.Patient,
                        required: true
                    }
                ]
            }
        ]
    }
];
async function getReportById(reportId, where = {}) {
    return models.Report.findByPk(reportId, {
        where,
        include: reportInclude
    });
}

module.exports = {
    getReportById
};
