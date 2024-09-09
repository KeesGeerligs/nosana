import platform
import psutil
import GPUtil
import subprocess
import os
import uuid
import speedtest
import time


def get_total_memory_size():
    memory_info = psutil.virtual_memory()
    return round(memory_info.total / (2**30), 2)

def get_system_info():
    system_info = platform.uname()
    ans = {}
    ans['system'] = system_info.system
    ans['node_name'] = system_info.node
    ans['release'] = system_info.release
    ans['version'] = system_info.version
    ans['machine'] = system_info.machine
    ans['processor'] = system_info.processor
    return ans

def get_cpu_info():
    cpu_info = platform.processor()
    cpu_count = psutil.cpu_count(logical=False)
    logical_cpu_count = psutil.cpu_count(logical=True)

    ans = {}
    ans['processor'] = cpu_info
    ans['physical_cores'] = cpu_count
    ans['logical_cores'] = logical_cpu_count
    return ans

def get_memory_info():
    memory_info = psutil.virtual_memory()

    ans = {}
    ans['total_memory_GB'] = round(memory_info.total / (2**30), 2)
    ans['available_memory_GB'] = round(memory_info.available / (2**30), 2)
    ans['used_memory_GB'] = round(memory_info.used / (2**30), 2)
    ans['memory_utilization'] = round(memory_info.percent, 2)
    return ans

def get_disk_info():
    disk_info = psutil.disk_usage('/')

    ans = {}
    ans['total_disk_space_GB'] = round(disk_info.total / (2**30), 2)
    ans['used_disk_space_GB'] = round(disk_info.used / (2**30), 2)
    ans['free_disk_space_GB'] = round(disk_info.free / (2**30), 2)
    ans['disk_space_utilization'] = round(disk_info.percent, 2)
    return ans

def get_gpu_info():
    ans = {}
    system_info = get_system_info()

    if system_info['system'] == 'Darwin':
        ans['0'] = "no_gpu"
        return ans
    else:
        gpus = GPUtil.getGPUs()
    
    if not gpus:
        ans['0'] = "no_gpu"
    else:
        ans['0'] = "there_is_gpu"

        for i, gpu in enumerate(gpus):
            ans[f'{i+1}'] = {}
            ans[f'{i+1}']['id'] = gpu.id
            ans[f'{i+1}']['name'] = ' '.join(gpu.name.splitlines())
            ans[f'{i+1}']['driver'] = gpu.driver
            ans[f'{i+1}']['gpu_memory_total_MB'] = gpu.memoryTotal
            ans[f'{i+1}']['gpu_memory_free_MB'] = gpu.memoryFree
            ans[f'{i+1}']['gpu_memory_used_MB'] = gpu.memoryUsed
            ans[f'{i+1}']['gpu_load_percent'] = gpu.load * 100
            ans[f'{i+1}']['gpu_temperature_C'] = gpu.temperature
    
    return ans

def check_windows_shell():
    parent_pid = os.getppid()
    shell_name = psutil.Process(parent_pid).name().lower()
    if 'cmd' in shell_name:
        return 'CMD'
    elif 'powershell' in shell_name:
        return 'PowerShell'
    else:
        return 'Unknown'

def get_extra():
    print("Starting to retrieve system configurations...")
    system_info = platform.uname()
    ans = {}
    ans['specs'] = {}
    ans['specs']['system'] = system_info.system
    ans['specs']['memory_GB'] = get_total_memory_size()
    ans['specs']['cpu'] = "unknown"
    ans['specs']['os_version'] = "unknown"

    # Add CPU, Memory, Disk, and GPU Info
    ans['specs']['cpu_info'] = get_cpu_info()
    ans['specs']['memory_info'] = get_memory_info()
    ans['specs']['disk_info'] = get_disk_info()
    ans['specs']['gpu_info'] = get_gpu_info()

    # Add internet speed check
    internet_speed = check_internet()
    ans['specs']['download_speed'] = internet_speed['download']
    ans['specs']['upload_speed'] = internet_speed['upload']

    try:
        if system_info.system == 'Darwin':
            r1 = subprocess.run(['system_profiler', 'SPHardwareDataType'], capture_output=True, text=True)
            for line in r1.stdout.split('\n'):
                if 'Model Identifier' in line:
                    ans['specs']['model'] = line[24:]
                if 'Chip' in line:
                    ans['specs']['cpu'] = line[12:]
            
            if ans['specs']['cpu'].startswith('Apple'):
                ans['specs']['gpu'] = ans['specs']['cpu']
            else:
                ans['specs']['gpu'] = 'no_gpu'
            
            r3 = subprocess.run(['system_profiler', 'SPSoftwareDataType'], capture_output=True, text=True)
            for line in r3.stdout.split('\n'):
                if 'System Version' in line:
                    ans['specs']['os_version'] = line[22:]
            return ans

        elif system_info.system == 'Linux':
            try:
                r2 = subprocess.run(['lsb_release', '-a'], capture_output=True, text=True)
                software = r2.stdout
                for line in software.split('\n'):
                    if 'Description' in line:
                        ans['specs']['os_version'] = line[12:].strip()
            except:
                r2 = subprocess.run(['cat', '/etc/os-release'], capture_output=True, text=True)
                software = r2.stdout
                for line in software.split('\n'):
                    if 'PRETTY_NAME' in line:
                        ans['specs']['os_version'] = line[12:].strip()
            
            try:
                r1 = subprocess.run(['lshw', '-C', 'cpu'], capture_output=True, text=True)
                for line in r1.stdout.split('\n'):
                    if 'product' in line:
                        ans['specs']['cpu'] = line[16:]
            except:
                cmd = ['lscpu']
                ps = subprocess.Popen(cmd, stdout=subprocess.PIPE)
                cmd = ['grep', 'Model name']
                grep = subprocess.Popen(cmd, stdin=ps.stdout, stdout=subprocess.PIPE, encoding='utf-8')
                ps.stdout.close()
                output, _ = grep.communicate()
                ans['specs']['cpu'] = output.split('\n')[0][16:].strip()

            gpu_info = get_gpu_info()
            if gpu_info['0'] == 'no_gpu':
                try:
                    r2 = subprocess.run(['lshw', '-C', 'display'], capture_output=True, text=True)
                    for line in r2.stdout.split('\n'):
                        if 'product' in line:
                            ans['specs']['gpu'] = line[16:]
                except:
                    ans['specs']['gpu'] = "no_gpu"
            else:
                ans['specs']['gpu_info'] = gpu_info
            return ans

        elif system_info.system == 'Windows':
            prefix_exe = 'powershell.exe'

            r_cpu = subprocess.run([prefix_exe, '(Get-WmiObject Win32_Processor).Name'], capture_output=True, text=True)
            ans['specs']['cpu'] = r_cpu.stdout.strip()
            r_gpu = subprocess.run([prefix_exe, '(Get-WmiObject Win32_VideoController).Caption'], capture_output=True, text=True)
            str_gpu = r_gpu.stdout.strip()
            ans['specs']['gpu'] = ' '.join(str_gpu.splitlines())
            r_os = subprocess.run([prefix_exe, '(Get-WmiObject Win32_OperatingSystem).Caption'], capture_output=True, text=True)
            ans['specs']['os_version'] = r_os.stdout.strip()

            gpu_info = get_gpu_info()
            if gpu_info['0'] != 'no_gpu':
                ans['specs']['gpu_info'] = gpu_info

        return ans

    except Exception as e:
        ans['error'] = f"Error retrieving system information: {e}"
    
    return ans

def check_internet():
    """Check and return the internet speed."""
    try:
        print("Starting internet speed test...")
        start_time = time.time()
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = st.download() / 1_000_000
        upload_speed = st.upload() / 1_000_000
        elapsed_time = time.time() - start_time
        print(f"Download Speed: {download_speed:.2f} Mbps")
        print(f"Upload Speed: {upload_speed:.2f} Mbps")
        print(f"Internet speed test duration: {elapsed_time:.2f} seconds\n")
        return {"download": round(download_speed, 2), "upload": round(upload_speed, 2)}
    except speedtest.ConfigRetrievalError as e:
        print(f"Failed to retrieve speed test configuration: {e}")
    except speedtest.SpeedtestException as e:
        print(f"Failed to complete the speed test: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    return {"download": "unknown", "upload": "unknown"}

def get_uuid():
    sys_info = get_extra()
    system_name = sys_info['specs']['system']
    cpu = sys_info['specs']['cpu']
    gpu = sys_info['specs']['gpu']
    memory = f"{sys_info['specs']['memory_GB']:.2f}"

    id_str = f"{system_name}|{cpu}|{gpu}|{memory}"
    uuid5 = uuid.uuid5(uuid.NAMESPACE_X500, id_str)
    return uuid5

if __name__ == "__main__":
    uuid5 = get_uuid()
    print("UUID version 5:", uuid5)
