import { BookingStatusCounts, FullBooking, FullBusiness, FullService, FullUser, PaginatedData } from "./models";

import { ApiMessage, ApiResult } from "@/lib/api/api-response";

/**
 *  Message Response
 */

export type MessageResponse = ApiResult<ApiMessage>;

/**
 *  User Response
 */

export type UserResponse = ApiResult<FullUser>;

/**
 *  Owner - Business Response
 */

export type BusinessResponse = ApiResult<FullBusiness>;
export type BusinessListResponse = ApiResult<FullBusiness[]>;

/**
 *  Owner - Service Response
 */

export type ServiceResponse = ApiResult<FullService>;
export type ServiceListResponse = ApiResult<FullService[]>;

/**
 *  Owner - Booking Response
 */

export type BookingResponse = ApiResult<FullBooking>;
export type BookingListResponse = ApiResult<FullBooking[]>;
export type BookingStatusCountsResponse = ApiResult<BookingStatusCounts>;

/**
 * Pagination Response
 */

export type PaginationResponse<T> = ApiResult<PaginatedData<T>>;
