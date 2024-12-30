import type {ForgeConfig} from '@electron-forge/shared-types';
import {MakerSquirrel} from '@electron-forge/maker-squirrel';
import {MakerDMG} from '@electron-forge/maker-dmg';
import {MakerZIP} from '@electron-forge/maker-zip';
import {MakerDeb} from '@electron-forge/maker-deb';
import {MakerRpm} from '@electron-forge/maker-rpm';
import {VitePlugin} from '@electron-forge/plugin-vite';
import {FusesPlugin} from '@electron-forge/plugin-fuses';
import {FuseV1Options, FuseVersion} from '@electron/fuses';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        icon: 'src/assets/icons/app-icon'
    },
    rebuildConfig: {},
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'SavenkoAlexander',
                    name: 'ai-assistant-ui'
                },
                prerelease: false,
            }
        }
    ],
    makers: [
        new MakerSquirrel({
            iconUrl: 'src/assets/icons/app-icon.ico'
        }),
        {
            name: '@electron-forge/maker-dmg',
            config: {
                background: 'src/assets/backgrounds/dmg-background.png',
                format: 'ULFO'
            }
        },
        // new MakerZIP({}, ['darwin']),
        new MakerRpm({
            options: {
                icon: 'src/assets/icons/png/256x256.png'
            },
        }),
        new MakerDeb({
            options: {
                icon: 'src/assets/icons/png/256x256.png'
            },
        })
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'src/main.ts',
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: 'src/preload.ts',
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;