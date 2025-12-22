##
# @file CMakeLists.txt
# @brief 
#/

# APP_PATH
set(APP_PATH ${CMAKE_CURRENT_LIST_DIR})

# APP_NAME
get_filename_component(APP_NAME ${APP_PATH} NAME)

# APP_SRCS
aux_source_directory(${APP_PATH}/src APP_SRCS)

# APP_INC
set(APP_INC
    ${APP_PATH}/include
    ${APP_PATH}/src
    ${APP_PATH}/../../src/libcjson/cJSON
    ${APP_PATH}/../../src/tuya_cloud_service/netmgr
    ${APP_PATH}/../../src/tuya_cloud_service/netcfg
    ${APP_PATH}/include/media
)

########################################
# Target Configure
########################################
add_library(${EXAMPLE_LIB})

target_sources(${EXAMPLE_LIB}
    PRIVATE
        ${APP_SRCS}
    )

target_include_directories(${EXAMPLE_LIB}
    PRIVATE
        ${APP_INC}
    )

########################################
# Add AI Audio Component
########################################
add_subdirectory(${APP_PATH}/../tuya.ai/ai_components/ai_audio ${CMAKE_BINARY_DIR}/ai_audio)
target_include_directories(${EXAMPLE_LIB} PRIVATE ${APP_PATH}/../tuya.ai/ai_components/ai_audio/include)
