export const adminMenu = [
    {
        // Quản lý người dùng
        name: "menu.admin.user",
        menus: [
            {
                name: "menu.admin.manage-user",
                link: "/system/manage-user",
            },
            {
                name: "menu.admin.manage-doctor",
                link: "/system/manage-doctor",
            },
            {
                // Quản lý kế hoạch khám bệnh
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
        ],
    },
    {
        // Quản lý phòng khám
        name: "menu.admin.clinic",
        menus: [
            {
                name: "menu.admin.manage-clinic",
                link: "/system/manage-clinic",
            },
        ],
    },
    {
        // Quản lý chuyên khoa
        name: "menu.admin.specialty",
        menus: [
            {
                name: "menu.admin.manage-specialty",
                link: "/system/manage-specialty",
            },
        ],
    },
];

export const doctorMenu = [
    {
        name: "menu.admin.user",
        menus: [
            {
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
            {
                name: "menu.doctor.manage-patient",
                link: "/doctor/manage-patient",
            },
        ],
    },
];
