interface ProfileEntity {
  id: number
  name: string
  is_recursive: number
}

interface GlpiProfile {
  name: string
  entities: ProfileEntity[]
}

interface SessionProfiles {
  [key: string]: GlpiProfile
}

export interface IGlpiSession {
  valid_id: string
  glpi_currenttime: string
  glpi_use_mode: number
  glpiID: number
  glpiis_ids_visible: string
  glpifriendlyname: string
  glpiname: string
  glpirealname: string
  glpifirstname: string
  glpiprofiles: SessionProfiles
}

export interface IResponseCurrentSession {
  session: IGlpiSession
}

export interface ITicketColumn {
  name: string
  table: string
  field: string
  datatype: string
  nosearch: boolean
  nodisplay: boolean
  available_searchtypes: string[]
  uid: string
}

export interface IResponseTicketColumns {
  [index: string]: ITicketColumn
}

export interface IDataTicket {
  [index: string]: string | string[] | number | number[] | null
}

export interface Link {
  rel: string
  href: string
}

export interface ITicketFiltered {
  id: number
  entities_id: number
  name: string
  date: string
  closedate: string
  solvedate: string
  takeintoaccountdate: string
  date_mod: string
  users_id_lastupdater: number
  status: number
  users_id_recipient: number
  requesttypes_id: number
  content: string
  urgency: number
  impact: number
  priority: number
  itilcategories_id: number
  type: number
  global_validation: number
  slas_id_ttr: number
  slas_id_tto: number
  slalevels_id_ttr: number
  time_to_resolve: string
  time_to_own: string
  begin_waiting_date: string
  sla_waiting_duration: number
  ola_waiting_duration: number
  olas_id_tto: number
  olas_id_ttr: number
  olalevels_id_ttr: number
  ola_ttr_begin_date: string
  internal_time_to_resolve: string
  internal_time_to_own: string
  waiting_duration: number
  close_delay_stat: number
  solve_delay_stat: number
  takeintoaccount_delay_stat: number
  actiontime: number
  is_deleted: number
  locations_id: number
  validation_percent: number
  date_creation: string
  ola_tto_begin_date: string
  links: Link[]
}

export interface IResponseTickets {
  totalcount: number
  count: number
  sort: number[]
  order: string[]
  'content-range': string
  data: IDataTicket[]
}

export interface Ticket {
  input: {
    name: string
    content: string
    itilcategories_id: number
    locations_id: number
    _users_id_requester: number
  }
}

export interface ILocation {
  id: number
  entities_id: number
  is_recursive: number
  name: string
  locations_id: number
  completename: string
  comment: string
  level: number
  ancestors_cache: string
  sons_cache: string
  address: string
  postcode: string
  town: string
  state: string
  country: string
  building: string
  room: string
  latitude: string
  longitude: string
  altitude: string
  date_mod: string
  date_creation: string
  links: Link[]
}

export interface IITILCategory {
  children?: IITILCategory[]
  id: number
  entities_id: number
  is_recursive: number
  itilcategories_id: number
  name: string
  completename: string
  comment: string
  level: number
  knowbaseitemcategories_id: number
  users_id: number
  groups_id: number
  code: string
  ancestors_cache: string
  sons_cache: null
  is_helpdeskvisible: number
  tickettemplates_id_incident: number
  tickettemplates_id_demand: number
  changetemplates_id: number
  problemtemplates_id: number
  is_incident: number
  is_request: number
  is_problem: number
  is_change: number
  date_mod: string
  date_creation: string
  links: Link[]
}

export interface IGLPITecnico {
  [index: string]: string | number | null
}

export interface IGLPITecnicosData {
  totalcount: number
  count: number
  sort: number[]
  order: string[]
  data: IGLPITecnico[]
}

export interface IResponsePostTicket {
  id: number
}

export interface WithDocuments {
  assocID: number
  assocdate: string
  entityID: number
  entity: string
  headings: null
  id: number
  entities_id: number
  is_recursive: number
  name: string
  filename: string
  filepath: string
  documentcategories_id: number
  mime: string
  date_mod: string
  comment: null
  is_deleted: number
  link: null
  users_id: number
  tickets_id: number
  sha1sum: string
  is_blacklisted: number
  tag: string
  date_creation: string
  links: Link[]
}

export interface ITicketFollowUp {
  id: number
  itemtype: string
  items_id: number
  date: string
  users_id: number
  users_id_editor: number
  content: string
  is_private: number
  requesttypes_id: number
  date_mod: string
  date_creation: string
  timeline_position: number
  sourceitems_id: number
  sourceof_items_id: number
  links: Link[]
  _documents?: WithDocuments[]
}

export interface IResponseAction {
  [key: string]: boolean | string
}

export type GetMultipleItemsReturn = {
  [x: string]: string | number | null | Link
  id: number
}

export interface FollowUp {
  input: {
    itemtype: string
    items_id: number
    users_id: number
    content: string
    is_private: number
    requesttypes_id: number
    sourceitems_id: number
    sourceof_items_id: number
  }
}

export interface UploadedFile {
  name: string
  size: number
  type: string
  prefix: string
  display: string
  filesize: string
  id: string
}

export interface UploadedResult {
  filename: UploadedFile[]
}

export interface ResponseUploadFiles {
  id: number
  message: string
  upload_result: UploadedResult
}

export interface DocumentsToBind {
  documentId: number
  ticketId: number
}

export interface IDocumentItem {
  id: number
  documents_id: number
  items_id: number
  itemtype: string
  entities_id: number
  is_recursive: number
  date_mod: string | null
  users_id: number
  timeline_position: number
  date_creation: string | null
  date: string | null
  links: Link
}

export interface DocumentsToBindFollowUp {
  documentId: number
  followUpId: number
}

export interface ITILSolution {
  id: number
  itemtype: string
  items_id: number
  solutiontypes_id: number
  solutiontype_name: string | null
  content: string
  date_creation: string
  date_mod: string
  date_approval: string | null
  users_id: number
  user_name: string | null
  users_id_editor: number
  users_id_approval: number
  user_name_approval: string | null
  status: number
  itilfollowups_id: number | null
  links: Link[]
}

export interface Solution {
  input: {
    status: number
    id: number
    date_approval: string
    users_id_approval: number
  }
}

interface IMutationResponse {
  [index: string]: string | boolean
}

export interface ICloseTicket {
  input: {
    status: number
    id: number
  }
}

export interface ISatisfactionTicket {
  id: number
  tickets_id: number
  type: number
  date_begin: string
  date_answered: string | null
  satisfaction: number | null
  comment: string | null
}

export interface IAnswerSatisfactionTicket {
  input: {
    tickets_id: number
    date_answered: string
    satisfaction: number
    comment?: string | null
  }
}
