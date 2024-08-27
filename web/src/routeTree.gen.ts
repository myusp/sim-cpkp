/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AboutImport } from './routes/about'
import { Route as guardImport } from './routes/__guard'
import { Route as guardPerawatIndexImport } from './routes/__guard.perawat/index'
import { Route as guardKaruIndexImport } from './routes/__guard.karu/index'
import { Route as guardAdminIndexImport } from './routes/__guard.admin/index'
import { Route as guardPerawatSelfAssesmenIndexImport } from './routes/__guard.perawat/self-assesmen/index'
import { Route as guardKaruPenilaianIndexImport } from './routes/__guard.karu/penilaian/index'
import { Route as guardKaruLogBookIndexImport } from './routes/__guard.karu/log-book/index'
import { Route as guardAdminReportIndexImport } from './routes/__guard.admin/report/index'
import { Route as guardPerawatSelfAssesmenNewImport } from './routes/__guard.perawat/self-assesmen/new'
import { Route as guardKaruPenilaianNewImport } from './routes/__guard.karu/penilaian/new'
import { Route as guardAdminReportIdImport } from './routes/__guard.admin/report/$id'
import { Route as guardAdminFormPenilaianImport } from './routes/__guard.admin/form/penilaian'
import { Route as guardAdminFormLogBookKaruImport } from './routes/__guard.admin/form/log-book-karu'
import { Route as guardAdminFormAssesmentImport } from './routes/__guard.admin/form/assesment'
import { Route as guardAdminDataRoomImport } from './routes/__guard.admin/data/room'
import { Route as guardAdminDataHospitalImport } from './routes/__guard.admin/data/hospital'
import { Route as guardAdminDataCpdImport } from './routes/__guard.admin/data/cpd'
import { Route as guardAdminDataAkunImport } from './routes/__guard.admin/data/akun'
import { Route as guardPerawatSelfAssesmenEditIdImport } from './routes/__guard.perawat/self-assesmen/edit/$id'
import { Route as guardKaruPenilaianViewIdImport } from './routes/__guard.karu/penilaian/view.$id'
import { Route as guardKaruLogBookViewAssessIdImport } from './routes/__guard.karu/log-book/view-assess.$id'
import { Route as guardKaruLogBookLogIdImport } from './routes/__guard.karu/log-book/log.$id'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const guardRoute = guardImport.update({
  id: '/__guard',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const guardPerawatIndexRoute = guardPerawatIndexImport.update({
  path: '/perawat/',
  getParentRoute: () => guardRoute,
} as any)

const guardKaruIndexRoute = guardKaruIndexImport.update({
  path: '/karu/',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminIndexRoute = guardAdminIndexImport.update({
  path: '/admin/',
  getParentRoute: () => guardRoute,
} as any)

const guardPerawatSelfAssesmenIndexRoute =
  guardPerawatSelfAssesmenIndexImport.update({
    path: '/perawat/self-assesmen/',
    getParentRoute: () => guardRoute,
  } as any)

const guardKaruPenilaianIndexRoute = guardKaruPenilaianIndexImport.update({
  path: '/karu/penilaian/',
  getParentRoute: () => guardRoute,
} as any)

const guardKaruLogBookIndexRoute = guardKaruLogBookIndexImport.update({
  path: '/karu/log-book/',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminReportIndexRoute = guardAdminReportIndexImport.update({
  path: '/admin/report/',
  getParentRoute: () => guardRoute,
} as any)

const guardPerawatSelfAssesmenNewRoute =
  guardPerawatSelfAssesmenNewImport.update({
    path: '/perawat/self-assesmen/new',
    getParentRoute: () => guardRoute,
  } as any)

const guardKaruPenilaianNewRoute = guardKaruPenilaianNewImport.update({
  path: '/karu/penilaian/new',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminReportIdRoute = guardAdminReportIdImport.update({
  path: '/admin/report/$id',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminFormPenilaianRoute = guardAdminFormPenilaianImport.update({
  path: '/admin/form/penilaian',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminFormLogBookKaruRoute = guardAdminFormLogBookKaruImport.update({
  path: '/admin/form/log-book-karu',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminFormAssesmentRoute = guardAdminFormAssesmentImport.update({
  path: '/admin/form/assesment',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminDataRoomRoute = guardAdminDataRoomImport.update({
  path: '/admin/data/room',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminDataHospitalRoute = guardAdminDataHospitalImport.update({
  path: '/admin/data/hospital',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminDataCpdRoute = guardAdminDataCpdImport.update({
  path: '/admin/data/cpd',
  getParentRoute: () => guardRoute,
} as any)

const guardAdminDataAkunRoute = guardAdminDataAkunImport.update({
  path: '/admin/data/akun',
  getParentRoute: () => guardRoute,
} as any)

const guardPerawatSelfAssesmenEditIdRoute =
  guardPerawatSelfAssesmenEditIdImport.update({
    path: '/perawat/self-assesmen/edit/$id',
    getParentRoute: () => guardRoute,
  } as any)

const guardKaruPenilaianViewIdRoute = guardKaruPenilaianViewIdImport.update({
  path: '/karu/penilaian/view/$id',
  getParentRoute: () => guardRoute,
} as any)

const guardKaruLogBookViewAssessIdRoute =
  guardKaruLogBookViewAssessIdImport.update({
    path: '/karu/log-book/view-assess/$id',
    getParentRoute: () => guardRoute,
  } as any)

const guardKaruLogBookLogIdRoute = guardKaruLogBookLogIdImport.update({
  path: '/karu/log-book/log/$id',
  getParentRoute: () => guardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/__guard': {
      id: '/__guard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof guardImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/__guard/admin/': {
      id: '/__guard/admin/'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof guardAdminIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/': {
      id: '/__guard/karu/'
      path: '/karu'
      fullPath: '/karu'
      preLoaderRoute: typeof guardKaruIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/perawat/': {
      id: '/__guard/perawat/'
      path: '/perawat'
      fullPath: '/perawat'
      preLoaderRoute: typeof guardPerawatIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/data/akun': {
      id: '/__guard/admin/data/akun'
      path: '/admin/data/akun'
      fullPath: '/admin/data/akun'
      preLoaderRoute: typeof guardAdminDataAkunImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/data/cpd': {
      id: '/__guard/admin/data/cpd'
      path: '/admin/data/cpd'
      fullPath: '/admin/data/cpd'
      preLoaderRoute: typeof guardAdminDataCpdImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/data/hospital': {
      id: '/__guard/admin/data/hospital'
      path: '/admin/data/hospital'
      fullPath: '/admin/data/hospital'
      preLoaderRoute: typeof guardAdminDataHospitalImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/data/room': {
      id: '/__guard/admin/data/room'
      path: '/admin/data/room'
      fullPath: '/admin/data/room'
      preLoaderRoute: typeof guardAdminDataRoomImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/form/assesment': {
      id: '/__guard/admin/form/assesment'
      path: '/admin/form/assesment'
      fullPath: '/admin/form/assesment'
      preLoaderRoute: typeof guardAdminFormAssesmentImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/form/log-book-karu': {
      id: '/__guard/admin/form/log-book-karu'
      path: '/admin/form/log-book-karu'
      fullPath: '/admin/form/log-book-karu'
      preLoaderRoute: typeof guardAdminFormLogBookKaruImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/form/penilaian': {
      id: '/__guard/admin/form/penilaian'
      path: '/admin/form/penilaian'
      fullPath: '/admin/form/penilaian'
      preLoaderRoute: typeof guardAdminFormPenilaianImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/report/$id': {
      id: '/__guard/admin/report/$id'
      path: '/admin/report/$id'
      fullPath: '/admin/report/$id'
      preLoaderRoute: typeof guardAdminReportIdImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/penilaian/new': {
      id: '/__guard/karu/penilaian/new'
      path: '/karu/penilaian/new'
      fullPath: '/karu/penilaian/new'
      preLoaderRoute: typeof guardKaruPenilaianNewImport
      parentRoute: typeof guardImport
    }
    '/__guard/perawat/self-assesmen/new': {
      id: '/__guard/perawat/self-assesmen/new'
      path: '/perawat/self-assesmen/new'
      fullPath: '/perawat/self-assesmen/new'
      preLoaderRoute: typeof guardPerawatSelfAssesmenNewImport
      parentRoute: typeof guardImport
    }
    '/__guard/admin/report/': {
      id: '/__guard/admin/report/'
      path: '/admin/report'
      fullPath: '/admin/report'
      preLoaderRoute: typeof guardAdminReportIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/log-book/': {
      id: '/__guard/karu/log-book/'
      path: '/karu/log-book'
      fullPath: '/karu/log-book'
      preLoaderRoute: typeof guardKaruLogBookIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/penilaian/': {
      id: '/__guard/karu/penilaian/'
      path: '/karu/penilaian'
      fullPath: '/karu/penilaian'
      preLoaderRoute: typeof guardKaruPenilaianIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/perawat/self-assesmen/': {
      id: '/__guard/perawat/self-assesmen/'
      path: '/perawat/self-assesmen'
      fullPath: '/perawat/self-assesmen'
      preLoaderRoute: typeof guardPerawatSelfAssesmenIndexImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/log-book/log/$id': {
      id: '/__guard/karu/log-book/log/$id'
      path: '/karu/log-book/log/$id'
      fullPath: '/karu/log-book/log/$id'
      preLoaderRoute: typeof guardKaruLogBookLogIdImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/log-book/view-assess/$id': {
      id: '/__guard/karu/log-book/view-assess/$id'
      path: '/karu/log-book/view-assess/$id'
      fullPath: '/karu/log-book/view-assess/$id'
      preLoaderRoute: typeof guardKaruLogBookViewAssessIdImport
      parentRoute: typeof guardImport
    }
    '/__guard/karu/penilaian/view/$id': {
      id: '/__guard/karu/penilaian/view/$id'
      path: '/karu/penilaian/view/$id'
      fullPath: '/karu/penilaian/view/$id'
      preLoaderRoute: typeof guardKaruPenilaianViewIdImport
      parentRoute: typeof guardImport
    }
    '/__guard/perawat/self-assesmen/edit/$id': {
      id: '/__guard/perawat/self-assesmen/edit/$id'
      path: '/perawat/self-assesmen/edit/$id'
      fullPath: '/perawat/self-assesmen/edit/$id'
      preLoaderRoute: typeof guardPerawatSelfAssesmenEditIdImport
      parentRoute: typeof guardImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  guardRoute: guardRoute.addChildren({
    guardAdminIndexRoute,
    guardKaruIndexRoute,
    guardPerawatIndexRoute,
    guardAdminDataAkunRoute,
    guardAdminDataCpdRoute,
    guardAdminDataHospitalRoute,
    guardAdminDataRoomRoute,
    guardAdminFormAssesmentRoute,
    guardAdminFormLogBookKaruRoute,
    guardAdminFormPenilaianRoute,
    guardAdminReportIdRoute,
    guardKaruPenilaianNewRoute,
    guardPerawatSelfAssesmenNewRoute,
    guardAdminReportIndexRoute,
    guardKaruLogBookIndexRoute,
    guardKaruPenilaianIndexRoute,
    guardPerawatSelfAssesmenIndexRoute,
    guardKaruLogBookLogIdRoute,
    guardKaruLogBookViewAssessIdRoute,
    guardKaruPenilaianViewIdRoute,
    guardPerawatSelfAssesmenEditIdRoute,
  }),
  AboutRoute,
  LoginRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/__guard",
        "/about",
        "/login"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/__guard": {
      "filePath": "__guard.tsx",
      "children": [
        "/__guard/admin/",
        "/__guard/karu/",
        "/__guard/perawat/",
        "/__guard/admin/data/akun",
        "/__guard/admin/data/cpd",
        "/__guard/admin/data/hospital",
        "/__guard/admin/data/room",
        "/__guard/admin/form/assesment",
        "/__guard/admin/form/log-book-karu",
        "/__guard/admin/form/penilaian",
        "/__guard/admin/report/$id",
        "/__guard/karu/penilaian/new",
        "/__guard/perawat/self-assesmen/new",
        "/__guard/admin/report/",
        "/__guard/karu/log-book/",
        "/__guard/karu/penilaian/",
        "/__guard/perawat/self-assesmen/",
        "/__guard/karu/log-book/log/$id",
        "/__guard/karu/log-book/view-assess/$id",
        "/__guard/karu/penilaian/view/$id",
        "/__guard/perawat/self-assesmen/edit/$id"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/__guard/admin/": {
      "filePath": "__guard.admin/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/": {
      "filePath": "__guard.karu/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/perawat/": {
      "filePath": "__guard.perawat/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/data/akun": {
      "filePath": "__guard.admin/data/akun.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/data/cpd": {
      "filePath": "__guard.admin/data/cpd.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/data/hospital": {
      "filePath": "__guard.admin/data/hospital.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/data/room": {
      "filePath": "__guard.admin/data/room.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/form/assesment": {
      "filePath": "__guard.admin/form/assesment.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/form/log-book-karu": {
      "filePath": "__guard.admin/form/log-book-karu.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/form/penilaian": {
      "filePath": "__guard.admin/form/penilaian.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/report/$id": {
      "filePath": "__guard.admin/report/$id.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/penilaian/new": {
      "filePath": "__guard.karu/penilaian/new.tsx",
      "parent": "/__guard"
    },
    "/__guard/perawat/self-assesmen/new": {
      "filePath": "__guard.perawat/self-assesmen/new.tsx",
      "parent": "/__guard"
    },
    "/__guard/admin/report/": {
      "filePath": "__guard.admin/report/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/log-book/": {
      "filePath": "__guard.karu/log-book/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/penilaian/": {
      "filePath": "__guard.karu/penilaian/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/perawat/self-assesmen/": {
      "filePath": "__guard.perawat/self-assesmen/index.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/log-book/log/$id": {
      "filePath": "__guard.karu/log-book/log.$id.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/log-book/view-assess/$id": {
      "filePath": "__guard.karu/log-book/view-assess.$id.tsx",
      "parent": "/__guard"
    },
    "/__guard/karu/penilaian/view/$id": {
      "filePath": "__guard.karu/penilaian/view.$id.tsx",
      "parent": "/__guard"
    },
    "/__guard/perawat/self-assesmen/edit/$id": {
      "filePath": "__guard.perawat/self-assesmen/edit/$id.tsx",
      "parent": "/__guard"
    }
  }
}
ROUTE_MANIFEST_END */
