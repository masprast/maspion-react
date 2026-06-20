import React, { useState, useEffect } from 'react';
import { GitHubRepo } from '../App';

interface RepoDetailModalProps {
  repo: GitHubRepo;
  onClose: () => void;
}

interface ExtraDetails {
  contributorsCount: number | string;
  files: { name: string; type: string }[];
  readmeHtml: string | null;
  languages: { [key: string]: number } | null;
}

const RepoDetailModal: React.FC<RepoDetailModalProps> = ({ repo, onClose }) => {
  const [details, setDetails] = useState<ExtraDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtraDetails = async () => {
      const cacheKey = `github_repo_details_${repo.id}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setDetails(JSON.parse(cached));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const owner = repo.owner?.login || repo.html_url.split('/')[3];
        const name = repo.name;
        const url = `https://api.github.com/repos/${owner}/${name}`

        const [contributorsRes, contentsRes, readmeRes, languagesRes] = await Promise.allSettled([
          (async () => {
            const res = await fetch(`${url}/contributors?per_page=1&anon=1`);
            if (!res.ok) return 0;

            const linkHeader = res.headers.get('link');
            if (linkHeader) {
              const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
              if (match) {
                return parseInt(match[1], 10);
              }
            }

            const data = await res.json();
            return data.length;
          })(),
          fetch(`${url}/contents`),
          fetch(`${url}/readme`, {
            headers: { Accept: 'application/vnd.github.html' },
          }),
          fetch(`${url}/languages`),
        ]);

        let contributorsCount: number | string = 0;
        if (contributorsRes.status === 'fulfilled') {
          contributorsCount = contributorsRes.value;
        }

        let files: { name: string; type: string }[] = [];
        if (contentsRes.status === 'fulfilled' && contentsRes.value.ok) {
          const contents = await contentsRes.value.json();
          if (Array.isArray(contents)) {
            files = contents.map((c: any) => ({ name: c.name, type: c.type }));
          }
        }

        let readmeHtml: string | null = null;
        if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
          readmeHtml = await readmeRes.value.text();
        }

        let languages: { [key: string]: number } | null = null;
        if (languagesRes.status === 'fulfilled' && languagesRes.value.ok) {
          languages = await languagesRes.value.json();
        }

        const newDetails = { contributorsCount, files, readmeHtml, languages };
        setDetails(newDetails);
        sessionStorage.setItem(cacheKey, JSON.stringify(newDetails));
      } catch (err) {
        console.error('Error fetching extra details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtraDetails();
  }, [repo]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center sm:bg-black/60 sm:p-6 backdrop-blur-sm transition-opacity">
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-[#f5f5f5] sm:rounded-xl flex flex-col overflow-hidden animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] sm:animate-none sm:shadow-2xl">
        <div className="flex items-center p-4 bg-[#4a90e2] text-white shadow-sm shrink-0">
          <button className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 sm:bg-white/20 sm:hover:bg-white/30 sm:rounded-md bg-transparent border-none text-white text-base font-medium cursor-pointer p-0 mr-4 transition-colors" onClick={onClose}>
            <i className="fas fa-arrow-left sm:hidden"></i>
            <i className="fas fa-times hidden sm:inline-block"></i>
            <span className="hidden sm:inline-block ml-2">Tutup</span>
          </button>
          <h2 className="text-lg font-semibold m-0 overflow-hidden text-ellipsis whitespace-nowrap">{repo.name}</h2>
        </div>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto text-base text-[#333]">
          <div className="mb-4">
            <p className="mb-4"><strong>Deskripsi:</strong> {repo.description || 'Tidak ada deskripsi.'}</p>
            <p className="mb-4"><strong>Bintang:</strong> {repo.stargazers_count}</p>
          </div>

          {loading ? (
            <div className="text-sm text-[#666] py-2 mt-5">Memuat detail tambahan...</div>
          ) : details ? (
            <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
              {details.languages && Object.keys(details.languages).length > 0 && (
                <p className="mb-4"><strong>Bahasa:</strong> {Object.keys(details.languages).join(', ')}</p>
              )}
              <p className="mb-4"><strong>Kontributor:</strong> {details.contributorsCount}</p>

              <div className="mt-4">
                <p className="mb-4"><strong>File/Folder Utama:</strong></p>
                <ul className="list-none p-0 m-0 bg-[#e0e0e0] rounded px-4 py-2 max-h-[200px] overflow-y-auto">
                  {details.files.length > 0 ? details.files.map((file, idx) => (
                    <li key={idx} className="py-2 font-mono text-sm text-[#333] border-b border-black/5 last:border-b-0 flex items-center">
                      <i className={file.type === 'dir' ? 'fas fa-folder' : 'fas fa-file'} style={{ marginRight: '8px', color: file.type === 'dir' ? '#4a90e2' : '#666', width: '16px', textAlign: 'center' }}></i>
                      <span className="truncate">{file.name}</span>
                    </li>
                  )) : <li className="py-2 text-sm">Tidak ada file yang ditemukan.</li>}
                </ul>
              </div>

              <div className="mt-6">
                <p className="mb-4"><strong>README:</strong></p>
                {details.readmeHtml ? (
                  <div
                    className="readme-container max-h-[400px] overflow-y-auto bg-white border border-[#ddd] rounded p-4 font-sans text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: details.readmeHtml }}
                  />
                ) : (
                  <p className="mb-4 text-[#666] italic">Tidak ada README.</p>
                )}
              </div>
            </div>
          ) : null}

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center mt-8 mb-2 p-3 text-base font-medium text-white bg-[#4a90e2] rounded hover:bg-[#357abd] active:translate-y-[1px] transition-all no-underline"
          >
            Buka Repositori di GitHub (Tab Baru)
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoDetailModal;
